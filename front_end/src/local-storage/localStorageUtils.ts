/**
 * A helper functions to add data into local storage.
 */
export function setToLocalStorage(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Get a value from local storage.
 * If value not exist, return null.
 * @param key A key string.
 */
export function getFromLocalStorage(key: string) {
  const value = localStorage.getItem(key);

  // Prevent typescript type check issue.
  if (value === null) {
    return null;
  }

  return JSON.parse(value);
}

/**
 * Remove a value from local storage.
 * @param key Key for local storage.
 */
export function removeFromLocalStorage(key: string) {
  localStorage.removeItem(key);
}
