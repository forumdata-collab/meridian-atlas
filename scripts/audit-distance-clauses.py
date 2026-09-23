"""Derive the per-region cun unit from the standard's own distance clauses, then
flag points whose spacing is an outlier for its region.

Method: for every clause of the form "<point> is N cun <direction> of <reference>"
where the reference resolves to another bound point, measure the actual 3D
distance and divide by N. Points in the same region share one proportional unit,
so a wildly different implied unit means either the point or its reference is
misplaced. Read-only.
"""
import json
import pathlib
import re
from collections import defaultdict

import numpy as np

ROOT = pathlib.Path('/home/ubuntu/meridian-atlas')
facts = json.loads((ROOT / 'lib/standard-location-facts.json').read_text())
reg = json.loads((ROOT / 'lib/mesh-registration.json').read_text())
pts = reg['points']

NAME_TO_ID = {}
for pid, v in reg['points'].items():
    pass
std = json.loads((ROOT / 'lib/national-standard.json').read_text())
std_pts = std.get('points', std)
for pid, v in std_pts.items():
    if isinstance(v, dict) and 'name' in v:
        NAME_TO_ID.setdefault(v['name'], pid)
for pid, v in (json.loads((ROOT / 'lib/extra-standard.json').read_text()).get('points', {}) or {}).items():
    if isinstance(v, dict) and 'name' in v:
        NAME_TO_ID.setdefault(v['name'], pid)


def bound_pos(pid):
    b = pts.get(pid)
    if not b:
        return None
    g = b.get('groupBindings') or [b]
    return np.array(g[0]['position'], dtype=float)


def resolve_ref(ref):
    """'犢鼻(ST35)' -> ST35 ; '內踝尖' -> EX-LE8 (documented landmark) ; else None."""
    m = re.search(r'\(([A-Z]{2}\d+\+?)\)', ref)
    if m:
        return m.group(1)
    m = re.match(r'^([A-Z]{2}\d+\+?)$', ref.strip())
    if m:
        return m.group(1)
    if ref.strip() in NAME_TO_ID:
        return NAME_TO_ID[ref.strip()]
    return None


rows = []
for pid, entry in facts['points'].items():
    for rel in entry.get('relations', []):
        if rel.get('kind') != 'distance':
            continue
        cun = rel.get('cun')
        ref = rel.get('reference') or ''
        if not cun or '/' in str(ref) or '+' in str(cun):
            continue
        target = resolve_ref(ref)
        if not target:
            continue
        a, b = bound_pos(pid), bound_pos(target)
        if a is None or b is None:
            continue
        d = float(np.linalg.norm(a - b))
        rows.append({'id': pid, 'ref': ref, 'refId': target, 'cun': float(cun),
                     'distM': d, 'unitM': d / float(cun), 'region': entry.get('region', '?')})

print(f'derived distance clauses with a resolvable bound reference: {len(rows)}')

by_region = defaultdict(list)
for r in rows:
    by_region[r['region']].append(r)

print(f'{"region":14} {"n":>3} {"median unit(m)":>14} {"min":>8} {"max":>8}   outliers')
outliers = []
for region, rs in sorted(by_region.items()):
    us = np.array([r['unitM'] for r in rs])
    med = float(np.median(us))
    out = [r for r in rs if med > 0 and (r['unitM'] > med * 1.8 or r['unitM'] < med / 1.8)]
    for o in out:
        outliers.append((o, med))
    print(f'{region:14} {len(rs):>3} {med:>14.5f} {us.min():>8.5f} {us.max():>8.5f}   {len(out)}')

print(f'\n=== outlier clauses ({len(outliers)}) ===')
for o, med in sorted(outliers, key=lambda x: -abs(np.log(x[0]["unitM"] / x[1]))):
    print(f'  {o["id"]:9} = {o["cun"]:g}寸 from {o["ref"]:22} -> {o["refId"]:9} '
          f'dist {o["distM"]*1000:7.1f}mm  implied unit {o["unitM"]:.5f} '
          f'(region median {med:.5f}, ratio {o["unitM"]/med:5.2f}x)')

# healthy reference: how tight is the spread overall?
allu = np.array([r['unitM'] for r in rows])
print(f'\noverall implied unit: median {np.median(allu):.5f}, '
      f'p10 {np.percentile(allu,10):.5f}, p90 {np.percentile(allu,90):.5f}')

out = ROOT / 'docs/reviews/distance-clause-audit.json'
out.write_text(json.dumps({'clauses': len(rows), 'outliers': len(outliers),
                           'outlierDetail': [{'id': o['id'], 'cun': o['cun'], 'ref': o['ref'],
                                              'refId': o['refId'], 'distMm': round(o['distM'] * 1000, 1),
                                              'unitM': round(o['unitM'], 5), 'regionMedian': round(m, 5)}
                                             for o, m in outliers]},
                          ensure_ascii=False, indent=1) + '\n')
print('wrote', out.relative_to(ROOT))
