import { NavigateFunction } from "react-router-dom";

/**
 * Similar to the original project. We reuse some code.
 */

export function reThrowGqlError(e: unknown) : never {
  if (e instanceof Error) {
    throw e;
  }

  throw new Error("Unknown error.");
}

export function toErrorPage(navigate: NavigateFunction, msg: string) {
  navigate('/error', { state: { info: msg } });
}

export function toErrorPageException(navigate: NavigateFunction, e: unknown) {
  navigate('/error', { state: { info: e instanceof Error ? e.message : 'Unknown error' } });
}
