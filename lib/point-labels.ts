import { roleNames } from './atlas';

export function pointLabel(name: string, roles: string[]) {
  const ordered = roleNames.filter((role) => roles.includes(role));
  if (roles.includes('大絡')) ordered.push('大絡');
  return ordered.length ? `${name}（${ordered.join('、')}）` : name;
}
