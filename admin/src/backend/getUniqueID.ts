import { nanoid } from "nanoid";

export default function getUniqueID(): string {
  return nanoid();
}