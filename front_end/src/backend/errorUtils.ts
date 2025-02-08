import { AxiosError, AxiosResponse } from "axios";

/**
 * Check if a object contain error.
 * @param obj
 */
export function isErrorObj(obj: any): boolean {
  return obj
      && obj.error !== undefined
      && obj.error.message !== undefined;
}

/**
 *
 * @param e
 */
export function reThrowAxiosError(e: unknown): never {
  if (!(e instanceof Error)) {
    throw new Error('Unknown error occur.');
  }

  // If AxiosError.
  if (e instanceof AxiosError) {
    if (e.response && isErrorObj(e.response.data)) {
      throw new Error(e.response.data.error.message);
    }

    throw new Error(e.message);
  }

  throw e;
}

/**
 * Check if a response contain error. If error set, throw exception.
 *
 * @param obj
 */
export function throwIsErrorResponse(obj: AxiosResponse): never | void {
  if (isErrorObj(obj.data)) {
    if (obj.data.error.message) {
      throw new Error(obj.data.error.message);
    }

    throw new Error('Unknown error occur');
  }
}