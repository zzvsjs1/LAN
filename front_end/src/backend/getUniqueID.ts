import { nanoid } from "nanoid";

/**
 * Create a unique id by using nanoid library.
 * More detail, please read the nanoid document.
 *
 * @returns {string} An unique id.
 */
export default function getUniqueID(): string {
  return nanoid();
}
