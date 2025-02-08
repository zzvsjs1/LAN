export const REACTION_LIKE = 'like';
export const REACTION_DISLIKE = 'dislike';

export function isSupportReaction(reaction: string): boolean {
  return reaction === REACTION_LIKE || reaction === REACTION_DISLIKE;
}
