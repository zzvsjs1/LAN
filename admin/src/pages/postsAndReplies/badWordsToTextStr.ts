export default function badWordsToTextStr(str: string[]): string {
  return Array.from(new Set(str)).join(', ');
}
