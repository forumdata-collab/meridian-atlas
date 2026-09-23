"""Audit extra points that rely on authored template coordinates (no mesh binding).

The registration covers the bound points. Anything in lib/extra-points.ts without
a binding is displayed straight from its authored Vec3, so this measures how far
those sit from the actual skin surface.
"""
import json
import pathlib
import re
import struct

import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent.parent
MODEL = ROOT / 'public/models/human-learning.glb'


def read_glb(path):
    raw = path.read_bytes()
    jl, _ = struct.unpack_from('<II', raw, 12)
    doc = json.loads(raw[20:20 + jl])
    bl, _ = struct.unpack_from('<II', raw, 20 + jl)
    binary = raw[28 + jl:28 + jl + bl]

    def acc(i, dt, w):
        a = doc['accessors'][i]
        v = doc['bufferViews'][a['bufferView']]
        off = v.get('byteOffset', 0) + a.get('byteOffset', 0)
        return np.frombuffer(binary, dtype=dt, count=a['count'] * w, offset=off).reshape(-1, w).copy()

    return acc(0, '<f4', 3).astype(float), acc(1, '<f4', 3).astype(float), \
        acc(2, '<u4', 1).reshape(-1, 3).astype(np.int64)


verts, normals, idx = read_glb(MODEL)
reg = json.loads((ROOT / 'lib/mesh-registration.json').read_text())
bound = set(reg['points'])

# parse the authored extras out of the TS source: [ 'ID', 'name', [x, y, z], 'loc', 'use' ]
src = (ROOT / 'lib/extra-points.ts').read_text()
entries = re.findall(
    r"\[\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\]",
    src)
print(f'extra-points.ts authored entries: {len(entries)}')

# nearest vertex distance as the surface probe (mesh is dense: 13380 verts)
def nearest_vertex_mm(p):
    d = np.linalg.norm(verts - p, axis=1)
    i = int(d.argmin())
    return float(d[i]) * 1000, i


rows = []
for pid, name, x, y, z in entries:
    p = np.array([float(x), float(y), float(z)])
    dist, vi = nearest_vertex_mm(p)
    has_binding = pid in bound
    rows.append((pid, name, dist, has_binding, p, vi))

print('\n=== extras WITHOUT a mesh binding (displayed from authored coords) ===')
nb = [r for r in rows if not r[3]]
print(f'count: {len(nb)}')
for pid, name, dist, _, p, vi in sorted(nb, key=lambda r: -r[2]):
    print(f'  {pid:9} {name:6} nearest-vertex {dist:7.2f} mm   at {np.round(p,3).tolist()}')

print('\n=== extras WITH a binding (binding wins in the app) ===')
wb = [r for r in rows if r[3]]
print(f'count: {len(wb)}')

# how far does the authored coordinate sit from the bound position?
print('\n=== authored coord vs bound position (same point, two sources) ===')
diffs = []
for pid, name, dist, has, p, vi in wb:
    b = reg['points'][pid]
    gs = b.get('groupBindings') or [b]
    bp = np.array(gs[0]['position'], dtype=float)
    d = float(np.linalg.norm(p - bp)) * 1000
    diffs.append((d, pid, name))
diffs.sort(reverse=True)
for d, pid, name in diffs[:12]:
    print(f'  {pid:9} {name:6} {d:7.1f} mm apart')
print(f'  median {np.median([d for d,_,_ in diffs]):.1f} mm over {len(diffs)} points')

out = ROOT / 'docs/reviews/extra-points-surface-sweep.json'
out.write_text(json.dumps({
    'authoredExtras': len(entries),
    'withoutBinding': [{'id': r[0], 'name': r[1], 'nearestVertexMm': round(r[2], 2)} for r in nb],
    'withBinding': len(wb),
    'authoredVsBoundMm': [{'id': p, 'name': n, 'mm': round(d, 1)} for d, p, n in diffs],
}, ensure_ascii=False, indent=1) + '\n')
print('\nwrote', out.relative_to(ROOT))
