export function isEmptyOrBlank(str: string): boolean {
  return isStringEmpty(str) || str.trim().length === 0;
}

export function isStringEmpty(str: string): boolean {
  console.assert(isString(str));
  return str.length === 0;
}

export function isString(obj: any): boolean {
  return typeof obj === 'string';
}
