import { reThrowAxiosError, throwIsErrorResponse } from "./errorUtils";
import LAN_AXIOS from "./lanAxios";
import { FOLLOWER_API } from "./backEndConfig";

export interface FollowingAndNoFollowingObjT {
  following: UserObj[],
  noFollowing: UserObj[],
}

/**
 * Get two arrays contain following and no following user from backend.
 * @param username
 */
export async function getFollowingAndNoFollowing(username: string): Promise<FollowingAndNoFollowingObjT> {
  try {
    // Use query.
    const ret = await LAN_AXIOS.get(
      `${FOLLOWER_API}/getFollowedAnUnfollowed`,
      { params: { followersUsername: username } }
    );
    throwIsErrorResponse(ret);
    return ret.data;
  } catch (e: unknown) {
    reThrowAxiosError(e);
  }
}

/**
 * Get all followings for a user.
 *
 * @param username
 */
export async function getUserFollowingPeople(username: string): Promise<UserObj[]> {
  try {
    const ret = await LAN_AXIOS.get(`${FOLLOWER_API}/username`,
      { params: { username: username } });

    throwIsErrorResponse(ret);
    return ret.data;
  } catch (e: unknown) {
    reThrowAxiosError(e);
  }
}

// Add a following to a user.
export async function addFollowing(followersUsername: string,
                                   followingUsername: string): Promise<void> {
  try {
    const ret = await LAN_AXIOS.post(
      `${FOLLOWER_API}`, {
        followersUsername: followersUsername,
        followingUsername: followingUsername
      }
    );

    throwIsErrorResponse(ret);
  } catch (e: unknown) {
    reThrowAxiosError(e);
  }
}

// Unfollowing a user.
export async function unFollowingUser(
  followersUsername: string,
  unfollowingUsername: string
): Promise<void> {
  try {
    const ret = await LAN_AXIOS.delete(
      `${FOLLOWER_API}/followersUsername/${followersUsername}/followingUsername/${unfollowingUsername}`
    );

    throwIsErrorResponse(ret);
  } catch (e: unknown) {
    reThrowAxiosError(e);
  }
}