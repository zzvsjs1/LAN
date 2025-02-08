import { NavigateFunction } from "react-router-dom";

/**
 * Goto the error page by a message.
 * @param navigate
 * @param msg
 */
export function toErrorPage(navigate: NavigateFunction, msg: string) {
  navigate('/error', { state: { info: msg } });
}

/**
 * Goto the error page by a exception object.
 * @param navigate
 * @param e
 */
export function toErrorPageException(navigate: NavigateFunction, e: unknown) {
  navigate('/error', { state: { info: e instanceof Error ? e.message : 'Unknown error' } });
}
