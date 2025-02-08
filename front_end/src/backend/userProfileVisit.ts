import { PROFILE_VISIT_API } from "./backEndConfig";
import LAN_AXIOS from "./lanAxios";
import { reThrowAxiosError } from "./errorUtils";

/**
 * Add a profile visit count to backend.
 * @param user
 */
export async function addProfileVisit(user: UserObj): Promise<void> {
  try {
    await LAN_AXIOS.post(`${PROFILE_VISIT_API}`, { username: user.username });
  } catch (e: unknown) {
    reThrowAxiosError(e);
  }
}