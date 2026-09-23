"""Sweep every registered binding plus every authored extra-point coordinate.

Measures, per point:
  - binding integrity (barycentric sum, offset magnitude, position consistency)
  - distance from the stored position to the nearest mesh surface (a 3 mm
    outward offset means "on the skin"; larger means the marker floats)
  - nearest-vertex distance as an independent cross-check

Read-only.
"""
import json
import pathlib
import struct
import sys

import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent.parent
MODEL = ROOT / 'public/models/human-learning.glb'


def read_glb(path):
    raw = path.read_bytes()
    json_length, _ = struct.unpack_from('<II', raw, 12)
    doc = json.loads(raw[20:20 + json_length])
    bin_len, _ = struct.unpack_from('<II', raw, 20 + json_length)
    binary = raw[28 + json_length:28 + json_length + bin_len]

    def acc(i, dt, w):
        a = doc['accessors'][i]
        v = doc['bufferViews'][a['bufferView']]
        off = v.get('byteOffset', 0) + a.get('byteOffset', 0)
        return np.frombuffer(binary, dtype=dt, count=a['count'] * w, offset=off).reshape(-1, w).copy()

    return (acc(0, '<f4', 3).astype(float), acc(2, '<u4', 1).reshape(-1, 3).astype(np.int64))


def point_tri_distance(p, a, b, c):
    """Closest distance from p to each triangle (Ericson)."""
    ab, ac = b - a, c - a
    ap = p - a
    d1 = np.einsum('ij,ij->i', ab, ap)
    d2 = np.einsum('ij,ij->i', ac, ap)
    bp = p - b
    d3 = np.einsum('ij,ij->i', ab, bp)
    d4 = np.einsum('ij,ij->i', ac, bp)
    cp = p - c
    d5 = np.einsum('ij,ij->i', ab, cp)
    d6 = np.einsum('ij,ij->i', ac, cp)

    out = np.empty((len(a), 3))
    # region A
    m = (d1 <= 0) & (d2 <= 0)
    out[m] = a[m]
    # region B
    m = (~m) & (d3 >= 0) & (d4 <= d3)
    out[m] = b[m]
    # region C
    prev = m.copy()
    m = (~prev) & (d6 >= 0) & (d5 <= d6)
    out[m] = c[m]
    # region AB
    prev |= m
    vc = d1 * d4 - d3 * d2
    m = (~prev) & (vc <= 0) & (d1 >= 0) & (d3 <= 0)
    v = np.divide(d1, d1 - d3, out=np.zeros_like(d1), where=(d1 - d3) != 0)
    out[m] = a[m] + v[m, None] * ab[m]
    # region AC
    prev |= m
    vb = d5 * d2 - d1 * d6
    m = (~prev) & (vb <= 0) & (d2 >= 0) & (d6 <= 0)
    w = np.divide(d2, d2 - d6, out=np.zeros_like(d2), where=(d2 - d6) != 0)
    out[m] = a[m] + w[m, None] * ac[m]
    # region BC
    prev |= m
    va = d3 * d6 - d5 * d4
    m = (~prev) & (va <= 0) & ((d4 - d3) >= 0) & ((d5 - d6) >= 0)
    denom = (d4 - d3) + (d5 - d6)
    w = np.divide(d4 - d3, denom, out=np.zeros_like(denom), where=denom != 0)
    out[m] = b[m] + w[m, None] * (c[m] - b[m])
    # interior
    prev |= m
    m = ~prev
    denom = va + vb + vc
    denom_safe = np.where(denom == 0, 1, denom)
    v = np.divide(vb, denom_safe)
    w = np.divide(vc, denom_safe)
    out[m] = a[m] + v[m, None] * ab[m] + w[m, None] * ac[m]
    return np.linalg.norm(out - p, axis=1)


def main():
    reg = json.loads((ROOT / 'lib/mesh-registration.json').read_text())
    verts, idx = read_glb(MODEL)
    faces = verts[idx]
    a, b, c = faces[:, 0], faces[:, 1], faces[:, 2]

    def flat(binding):
        g = binding.get('groupBindings')
        return g if g else [binding]

    print(f'mesh: {len(verts)} verts, {len(idx)} tris')
    rows = []
    n_bindings = 0
    for pid, binding in reg['points'].items():
        for g in flat(binding):
            n_bindings += 1
            p = np.array(g['position'], dtype=float)
            tri = verts[idx[g['face']]]
            bary = np.array(g['barycentric'], dtype=float)
            on_face = bary @ tri
            pos_err = float(np.linalg.norm((on_face + np.array(g['offset'], dtype=float)) - p))
            d = point_tri_distance(p, a, b, c)
            nearest = float(d.min())
            rows.append((pid, g.get('method', '?'), g.get('regionRule', '?'),
                         float(np.linalg.norm(g['offset'])) * 1000, pos_err * 1000,
                         nearest * 1000, float(g.get('seedDistance', 0)) * 1000))

    print(f'bindings checked: {n_bindings} across {len(reg["points"])} ids')
    arr = np.array([[r[3], r[4], r[5], r[6]] for r in rows])
    print('\nsurface distance (mm) from stored position to nearest triangle:')
    print(f'  min {arr[:,2].min():.2f} | median {np.median(arr[:,2]):.2f} | '
          f'p95 {np.percentile(arr[:,2],95):.2f} | max {arr[:,2].max():.2f}')
    print(f'offset magnitude (mm): median {np.median(arr[:,0]):.3f}, max {arr[:,0].max():.3f}')
    print(f'position consistency error (mm): max {arr[:,1].max():.6f}')

    print('\n=== bindings with surface distance > 6 mm (float / sunk) ===')
    off = sorted(rows, key=lambda r: -r[5])
    for pid, method, rule, offset, perr, near, seed in off:
        if near > 6:
            print(f'  {pid:9} surface {near:7.2f}mm  offset {offset:5.2f}mm  seed {seed:6.1f}mm  '
                  f'{method} / {rule}')
    n_bad = sum(1 for r in rows if r[5] > 6)
    print(f'  -> {n_bad} of {n_bindings} bindings')

    print('\n=== offset magnitude not ~3 mm ===')
    weird = [r for r in rows if abs(r[3] - 3.0) > 0.05]
    for pid, method, rule, offset, perr, near, seed in weird[:15]:
        print(f'  {pid:9} offset {offset:7.3f}mm  surface {near:7.2f}mm  {method}')
    print(f'  -> {len(weird)} bindings')

    out = ROOT / 'docs/reviews/all-points-surface-sweep.json'
    out.write_text(json.dumps({
        'bindingsChecked': n_bindings,
        'surfaceDistanceMm': {'min': float(arr[:, 2].min()), 'median': float(np.median(arr[:, 2])),
                              'p95': float(np.percentile(arr[:, 2], 95)), 'max': float(arr[:, 2].max())},
        'over6mm': [{'id': r[0], 'surfaceMm': round(r[5], 2), 'offsetMm': round(r[3], 2),
                     'seedMm': round(r[6], 1), 'method': r[1], 'regionRule': r[2]}
                    for r in sorted(rows, key=lambda r: -r[5]) if r[5] > 6],
    }, ensure_ascii=False, indent=1) + '\n')
    print('\nwrote', out.relative_to(ROOT))


if __name__ == '__main__':
    main()
