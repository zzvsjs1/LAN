import badWord from './badword.json';

// Check if the text include bad words.
export default function isBadWord(text: string): string[] {
  const ret = [];

  // Remove html tags.
  const newStr = text.replace(/<(.|\n)*?>/g, '');
  // Convert to lower case.
  const lower = newStr.toLowerCase();
  for (const word of badWord.words) {

    // Check sub string in the text./
    if (lower.includes(word.toLowerCase())) {
      ret.push(word);
    }
  }

  return ret;
}
