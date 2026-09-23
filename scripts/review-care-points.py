"""Geometry review of the points the /care page teaches.

Read-only: never rewrites `lib/mesh-registration.json`.

What this establishes, and what it does NOT
-------------------------------------------
Per docs/DATA.md, surface attachment plus a recomputed proportional rule is
NOT anatomical validation. Every number below is geometry evidence on the
pinned learning mesh. "Pass" means "matches the rule we can recompute", not
"clinically correct". Landmarks that the source asset cannot prove (xiphoid,
pubic edge, rib planes, bone edges) stay estimates and are reported as such.

Usage:
  python3 scripts/review-care-points.py [--render docs/images/care-points-review.png]
"""
import hashlib
import json
import math
import pathlib
import struct
import sys

import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent.parent
REGISTRATION = ROOT / 'lib/mesh-registration.json'
MODEL = ROOT / 'public/models/human-learning.glb'
GLB_SHA256 = '1be7f0f1fcb0e79de628fb03ec0d7f6a414813e95798ebfe0140d66c1fb4a579'

# id -> (name, topic)
CARE = {
    'LR3': ('太衝', '壓力'), 'LI4': ('合谷', '壓力'), 'PC6': ('內關', '壓力'),
    'GV20': ('百會', '壓力'), 'HT7': ('神門', '失眠'), 'N-HN54': ('安眠', '失眠'),
    'SP6': ('三陰交', '失眠・水腫'), 'KI1': ('湧泉', '失眠・增高'), 'GV24+': ('印堂', '失眠'),
    'CV9': ('水分', '水腫'), 'SP9': ('陰陵泉', '水腫'), 'ST36': ('足三里', '水腫・增高'),
    'GV12': ('身柱', '增高'), 'BL20': ('脾俞', '增高'), 'BL23': ('腎俞', '增高'),
}
# Tolerance bands. 15 mm is roughly half a cun on this mesh; beyond it the
# rule recomputation is no longer explainable by the asset's own estimates.
TOL_STRICT = 0.006
TOL_MODEL = 0.015


def read_glb(path):
    raw = path.read_bytes()
    magic, version, length = struct.unpack_from('<III', raw)
    if (magic, version, length) != (0x46546C67, 2, len(raw)):
        raise SystemExit('invalid GLB')
    json_length, kind = struct.unpack_from('<II', raw, 12)
    if kind != 0x4E4F534A:
        raise SystemExit('missing GLB JSON chunk')
    doc = json.loads(raw[20:20 + json_length])
    bin_len, bin_type = struct.unpack_from('<II', raw, 20 + json_length)
    if bin_type != 0x004E4942:
        raise SystemExit('missing GLB BIN chunk')
    binary = raw[28 + json_length:28 + json_length + bin_len]

    def accessor(i, dtype, width):
        a = doc['accessors'][i]
        view = doc['bufferViews'][a['bufferView']]
        off = view.get('byteOffset', 0) + a.get('byteOffset', 0)
        return np.frombuffer(binary, dtype=dtype, count=a['count'] * width,
                             offset=off).reshape(-1, width).copy()

    return (accessor(0, '<f4', 3).astype(float), accessor(1, '<f4', 3).astype(float),
            accessor(2, '<u4', 1).reshape(-1, 3).astype(np.int64))


def z_ray_parity(faces, point):
    """Crossings of a +Z ray; odd means the point sits inside the envelope."""
    a, b, c = faces[:, 0], faces[:, 1], faces[:, 2]
    u, v, q = (b - a)[:, :2], (c - a)[:, :2], (point - a)[:, :2]
    det = u[:, 0] * v[:, 1] - u[:, 1] * v[:, 0]
    safe = np.where(np.abs(det) > 1e-15, det, 1.0)
    s = (q[:, 0] * v[:, 1] - q[:, 1] * v[:, 0]) / safe
    t = (u[:, 0] * q[:, 1] - u[:, 1] * q[:, 0]) / safe
    ok = (np.abs(det) > 1e-15) & (s >= -1e-9) & (t >= -1e-9) & (s + t <= 1 + 1e-9)
    if not ok.any():
        return 0
    z = a[ok, 2] + s[ok] * (b[ok, 2] - a[ok, 2]) + t[ok] * (c[ok, 2] - a[ok, 2])
    return int(np.count_nonzero(z > point[2]))


def render(report, vertices, normals, indices, flat, out_path):
    from PIL import Image, ImageDraw
    colors = {'LR3': '#67bf9e', 'LI4': '#efb36a', 'PC6': '#ba8ce6', 'GV20': '#f7bb79',
              'HT7': '#f184a0', 'N-HN54': '#dc85b8', 'SP6': '#e49a72', 'KI1': '#9e9dea',
              'GV24+': '#e3d58c', 'CV9': '#e3d58c', 'SP9': '#e49a72', 'ST36': '#e8c264',
              'GV12': '#f7bb79', 'BL20': '#83a6f1', 'BL23': '#83a6f1'}
    panels = [('FRONT', 0.0), ('LEFT', math.pi / 2), ('BACK', math.pi)]
    W, H = 620, 1000
    img = Image.new('RGB', (W * len(panels), H), '#10212a')
    draw = ImageDraw.Draw(img)
    bindings = json.loads(REGISTRATION.read_text())['points']
    for panel, (label, angle) in enumerate(panels):
        m = np.array([[math.cos(angle), 0, math.sin(angle)], [0, 1, 0],
                      [-math.sin(angle), 0, math.cos(angle)]])
        v, n = vertices @ m.T, normals @ m.T
        fv, fn = v[indices], n[indices].mean(axis=1)
        scale, base = 470.0, 0.0
        del base

        def screen(p):
            return (panel * W + W / 2 + p[0] * scale, H - 60 - p[1] * scale)

        for i in np.argsort(fv[:, :, 2].mean(axis=1)):
            if fn[i, 2] < -0.05:
                continue
            br = float(np.clip(0.47 + 0.45 * np.dot(fn[i], [-0.3, 0.4, 0.85]), 0.15, 1.0))
            draw.polygon([screen(p) for p in fv[i]],
                         fill=tuple(int(br * c) for c in (147, 184, 192)))
        for pid in report['points']:
            b = bindings.get(pid)
            if not b:
                continue
            color = colors.get(pid, '#f5de93')
            for g in flat(b):
                nrm = np.array(g['barycentric']) @ normals[indices[g['face']]]
                if float((nrm @ m.T)[2]) < 0.1:
                    continue
                p = np.array(g['position']) @ m.T
                x, y = screen(p)
                draw.ellipse((x - 3, y - 3, x + 3, y + 3), outline=color, width=2)
                draw.text((x + 6, y - 7), pid, fill=color)
        draw.text((panel * W + 18, 18), label, fill='white')
    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.resize((img.width // 2, img.height // 2)).save(out_path)
    print('wrote', out_path.relative_to(ROOT))


def main():
    render_to = None
    if '--render' in sys.argv:
        render_to = (ROOT / sys.argv[sys.argv.index('--render') + 1]).resolve()

    model_bytes = MODEL.read_bytes()
    if hashlib.sha256(model_bytes).hexdigest() != GLB_SHA256:
        raise SystemExit('model hash does not match the pinned learning mesh')
    reg_bytes = REGISTRATION.read_bytes()
    reg = json.loads(reg_bytes)
    vertices, normals, indices = read_glb(MODEL)
    faces = vertices[indices]
    lm = reg['landmarks']

    def flat(b):
        g = b.get('groupBindings')
        return g if g else [b]

    def p_of(pid, side=0):
        b = reg['points'].get(pid)
        if not b:
            return None
        f = flat(b)
        return np.array(f[min(side, len(f) - 1)]['position'], dtype=float)

    # --- scales, each tied to the citation it comes from -------------------
    cun_abdomen = (lm['xiphoidY'] - lm['navelY']) / 8.0          # GB/T 表1 胸劍聯合→臍中 8寸
    knee_y = 0.49670949162309636                                  # lower-leg-spec.json
    st41_y = float(p_of('ST41')[1])
    exle8_y = float(p_of('EX-LE8')[1])
    cun_calf_lateral = (knee_y - st41_y) / 16.0                   # 膝中→外踝尖 16寸
    cun_calf_medial = (knee_y - exle8_y) / 15.0                   # 膝中→內踝尖 15寸
    cun_back = float(abs(p_of('BL43')[0])) / 3.0                  # 後正中線→肩胛骨內側緣 3寸
    mesh_max_y = float(vertices[:, 1].max())

    scales = {'cunAbdomenUp': round(cun_abdomen, 6), 'cunCalfLateral16': round(cun_calf_lateral, 6),
              'cunCalfMedial15': round(cun_calf_medial, 6), 'cunBack3': round(cun_back, 6),
              'meshMaxY': round(mesh_max_y, 6),
              'sources': {'cunAbdomenUp': 'GB/T 12346-2021 表1（胸劍聯合→臍中 8寸）',
                          'cunCalfLateral16': 'GB/T 12346-2021 表1（膝中→外踝尖 16寸）',
                          'cunCalfMedial15': 'GB/T 12346-2021 表1（膝中→內踝尖 15寸）',
                          'cunBack3': 'GB/T 12346-2021 表1（後正中線→肩胛骨內側緣 3寸），以 BL43 膏肓（旁開3寸）反推'}}
    print('mesh %d verts / %d tris, maxY %.4f' % (len(vertices), len(indices), mesh_max_y))
    print('scales (m per 寸): abdomen %.5f | calf-lat %.5f | calf-med %.5f | back %.5f'
          % (cun_abdomen, cun_calf_lateral, cun_calf_medial, cun_back))

    report = {'scope': 'docs/DATA.md 所述層級：表面吸附 + 可重算比例規則 = 幾何證據，非解剖校準。',
              'source': {'registrationSha256': hashlib.sha256(reg_bytes).hexdigest(),
                         'modelSha256': GLB_SHA256, 'scales': scales},
              'points': {}, 'findings': [], 'checks': []}

    def flag(msg, severe=False):
        report['findings'].append(('FAIL ' if severe else 'NOTE ') + msg)

    for pid, (name, topic) in CARE.items():
        e = {'id': pid, 'name': name, 'topic': topic, 'flags': []}
        b = reg['points'].get(pid)
        if b is None:
            e['flags'].append('MISSING-BINDING')
            flag('%s %s：註冊表無綁定，3D 連結會失效' % (pid, name), severe=True)
            report['points'][pid] = e
            continue
        e['method'] = b.get('method')
        e['regionRule'] = b.get('regionRule')
        e['seedDistanceMm'] = round(b.get('seedDistance', 0) * 1000, 1)
        e['sides'] = len(flat(b))
        p0 = p_of(pid)
        e['position'] = [round(float(v), 5) for v in p0]
        e['y'], e['x'] = round(float(p0[1]), 5), round(float(p0[0]), 5)

        # 1. binding integrity
        integ = []
        for g in flat(b):
            bary = np.array(g['barycentric'], dtype=float)
            err = float(np.linalg.norm((bary @ vertices[indices[g['face']]]
                                        + np.array(g['offset'], dtype=float)) - np.array(g['position'], dtype=float)))
            integ.append({'barySum': round(float(bary.sum()), 9), 'baryMin': round(float(bary.min()), 9),
                          'offsetMm': round(float(np.linalg.norm(g['offset'])) * 1000, 3),
                          'positionErrMm': round(err * 1000, 6)})
            if abs(bary.sum() - 1) > 1e-6 or bary.min() < -1e-9:
                e['flags'].append('BARYCENTRIC-INVALID')
                flag('%s %s：重心座標無效' % (pid, name), severe=True)
            if err > 1e-6:
                e['flags'].append('POSITION-MISMATCH')
                flag('%s %s：位置與綁定不符 %.3fmm' % (pid, name, err * 1000), severe=True)
        e['integrity'] = integ

        # 2. containment
        parity = z_ray_parity(faces, p0)
        e['zRayParity'] = parity
        if parity % 2 == 1:
            e['flags'].append('INSIDE-ENVELOPE')
            flag('%s %s：落在皮膚包絡內（未貼表面）' % (pid, name), severe=True)

        # 3. bilateral mirroring
        if len(flat(b)) == 2:
            xs = sorted(round(g['position'][0], 5) for g in flat(b))
            ys = [round(g['position'][1], 5) for g in flat(b)]
            e['bilateral'] = {'x': xs, 'sameY': abs(ys[0] - ys[1]) < 1e-4}
            if abs(xs[0] + xs[1]) > 2e-3:
                e['flags'].append('NOT-MIRRORED')
                flag('%s %s：左右未對稱 %s' % (pid, name, xs), severe=True)

        report['points'][pid] = e

    # 4. rule recomputation: each row needs (recomputed expectation, tolerance, citation)
    def y(pid):
        p = p_of(pid)
        return None if p is None else float(p[1])

    def x(pid):
        p = p_of(pid)
        return None if p is None else float(p[0])

    rules = [
        ('CV9', '臍中上 1 寸', lm['navelY'] + cun_abdomen, TOL_STRICT,
         'GB/T 12346-2021 5.14.9；臍中高度為網格實測'),
        ('SP6', '內踝尖上 3 寸', exle8_y + 3 * cun_calf_medial, TOL_MODEL,
         '5.4.6；內踝尖取 EX-LE8，寸制沿用 lower-leg-spec.json 小腿內側 15 寸'),
        ('ST36', '犢鼻(ST35)下 3 寸', knee_y - 3 * cun_calf_lateral, TOL_MODEL,
         '5.3.36；犢鼻水平取 lower-leg-spec.json 膝中，寸制用小腿外側 16 寸'),
        ('SP9', '內踝尖上 13 寸（脛骨內側髁下方）', exle8_y + 13 * cun_calf_medial, TOL_MODEL,
         '5.4.9；GB/T 表1 脛骨內側髁下方→內踝尖 13 寸，與 15 寸同制'),
    ]
    for pid, label, expect, tol, cite in rules:
        e = report['points'].get(pid)
        if not e or 'y' not in e:
            continue
        dev = e['y'] - expect
        ok = abs(dev) <= tol
        report['checks'].append({'id': pid, 'rule': label, 'expectedY': round(expect, 5),
                                 'actualY': e['y'], 'deviationMm': round(dev * 1000, 1),
                                 'toleranceMm': round(tol * 1000, 1), 'ok': bool(ok), 'citation': cite})
        if not ok:
            flag('%s %s：%s 差 %+.1fmm（容差 %.0fmm）' % (pid, e['name'], label, dev * 1000, tol * 1000))

    # 5. midline and shared levels
    for pid in ['GV12', 'GV20', 'CV9', 'GV24+']:
        if pid in report['points'] and abs(report['points'][pid]['x']) > 1e-4:
            flag('%s %s：應在正中線，實際 x=%s' % (pid, report['points'][pid]['name'],
                                                report['points'][pid]['x']), severe=True)
    if y('GV12') is not None and y('BL13') is not None:
        gap = abs(y('GV12') - y('BL13'))
        report['checks'].append({'id': 'GV12/BL13', 'rule': '第3胸椎棘突下同高（身柱 ↔ 肺俞）',
                                 'gapMm': round(gap * 1000, 3), 'ok': gap < 1e-4,
                                 'citation': 'GB/T 12346-2021 5.13.12 與 5.7.13'})
        if gap >= 1e-4:
            flag('GV12 與 BL13 不同高（差 %.1fmm）' % (gap * 1000))

    # 6. back 1.5-cun line, measured against the 3-cun line
    for pid in ['BL20', 'BL23']:
        e = report['points'].get(pid)
        if not e:
            continue
        dev = abs(e['x']) - 1.5 * cun_back
        ok = abs(dev) <= TOL_STRICT
        report['checks'].append({'id': pid, 'rule': '後正中線旁開 1.5 寸（對比 3 寸線）',
                                 'expectedX': round(1.5 * cun_back, 5), 'actualX': round(abs(e['x']), 5),
                                 'deviationMm': round(dev * 1000, 1), 'ok': bool(ok),
                                 'citation': 'GB/T 12346-2021 5.7.20／5.7.23，3 寸線由 BL43 反推'})
        if not ok:
            flag('%s %s：旁開 1.5 寸差 %+.1fmm' % (pid, e['name'], dev * 1000))

    # 7. forearm: PC6 is 2 cun above the wrist crease
    ht7, pc6 = y('HT7'), y('PC6')
    if ht7 and pc6:
        forearm = (pc6 - ht7) / 2 * 12
        ok = 0.22 <= forearm <= 0.33
        report['checks'].append({'id': 'PC6/HT7', 'rule': '腕橫紋上 2 寸 → 前臂 12 寸應為 0.22–0.33m',
                                 'gapMm': round((pc6 - ht7) * 1000, 1), 'impliedForearmM': round(forearm, 3),
                                 'ok': bool(ok), 'citation': 'GB/T 12346-2021 5.9.6；表1 肘橫紋→腕橫紋 12寸'})
        if not ok:
            flag('PC6 距 HT7 %+.1fmm，換算前臂 12 寸 %.3fm 不合理' % ((pc6 - ht7) * 1000, forearm))

    # 8. vertical ordering that anatomy fixes regardless of mesh scale
    order = [('GV20', 'GV24+'), ('GV24+', 'N-HN54'), ('GV12', 'BL20'), ('BL20', 'BL23'),
             ('BL23', 'CV9'), ('CV9', 'SP9'), ('SP9', 'ST36'), ('ST36', 'SP6'), ('SP6', 'KI1'),
             ('PC6', 'HT7'), ('HT7', 'LI4'), ('LI4', 'LR3'), ('LR3', 'KI1')]
    for a, c in order:
        ya, yc = y(a), y(c)
        if ya is None or yc is None:
            continue
        ok = ya > yc
        report['checks'].append({'id': '%s>%s' % (a, c), 'rule': '縱向次序', 'ok': bool(ok),
                                 'aY': round(ya, 5), 'bY': round(yc, 5), 'gapMm': round((ya - yc) * 1000, 1)})
        if not ok:
            flag('%s 應高於 %s，實際 %.4f vs %.4f' % (a, c, ya, yc), severe=True)

    # report
    print('\n%-8s %-7s %-26s %-9s %-9s %s' % ('id', 'name', 'method', 'seed(mm)', 'y', 'flags'))
    for pid in CARE:
        e = report['points'][pid]
        print('%-8s %-7s %-26s %-9s %-9s %s' % (pid, e['name'], e.get('method', '-'),
                                                e.get('seedDistanceMm', '-'), e.get('y', '-'),
                                                ','.join(e['flags']) or 'ok'))
    print('\n%-14s %-34s %-10s %-10s %s' % ('id', 'rule', 'expect', 'actual', 'dev'))
    for c in report['checks']:
        if 'deviationMm' in c:
            print('%-14s %-34s %-10s %-10s %+.1fmm  %s' % (c['id'], c['rule'][:34], c.get('expectedY', c.get('expectedX')),
                                                           c.get('actualY', c.get('actualX')), c['deviationMm'],
                                                           'ok' if c['ok'] else 'CHECK'))
        elif 'gapMm' in c:
            print('%-14s %-34s %-10s %-10s %+.1fmm  %s' % (c['id'], c['rule'][:34], '-', '-',
                                                           c['gapMm'], 'ok' if c['ok'] else 'CHECK'))
    print('\n=== findings (%d) ===' % len(report['findings']))
    for f in report['findings']:
        print(' ', f)
    severe = [f for f in report['findings'] if f.startswith('FAIL')]
    report['summary'] = {'pointsReviewed': len(report['points']),
                         'checksRun': len(report['checks']),
                         'severeFindings': len(severe),
                         'note': '無嚴重問題' if not severe else '有 %d 項需處理' % len(severe)}
    print('\nsummary:', json.dumps(report['summary'], ensure_ascii=False))

    out = ROOT / 'docs/reviews/care-points-geometry.json'
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(report, ensure_ascii=False, indent=1) + '\n')
    print('wrote', out.relative_to(ROOT))
    if render_to:
        render(report, vertices, normals, indices, flat, render_to)


if __name__ == '__main__':
    main()
