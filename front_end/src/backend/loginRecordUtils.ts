import LAN_AXIOS from "./lanAxios";
import { USER_LOGIN_COUNT_API } from "./backEndConfig";
import { reThrowAxiosError } from "./errorUtils";

/**
 * Add one login record to backend.
 * @param user
 */
export async function addUserLoginCount(user: UserObj) {
  try {
    // Add one record.
    await LAN_AXIOS.post(USER_LOGIN_COUNT_API, { username: user.username });
  } catch (e: unknown) {
    reThrowAxiosError(e);
  }
}
