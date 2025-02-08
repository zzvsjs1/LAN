// These code idea is borrow from
// RMIT university further web programming
// example code (week 4).

import { getFromLocalStorage, removeFromLocalStorage, setToLocalStorage } from '../local-storage/localStorageUtils';
import LAN_AXIOS from "./lanAxios";
import { reThrowAxiosError, throwIsErrorResponse } from "./errorUtils";
import { USER_API, USER_SIGNIN } from "./backEndConfig";

export const USER_KEY = 'USER';

/**
 * User object structure
 *
 * username: str
 * email: str
 * password: sr
 * joinDate: str NOTE: You need to convert the string into Date object. Use jsonUserToUserObj
 *               to finish this job.
 * avatar: url
 * secretQuestions: [{ question: answer }]
 */
export function createUserObj(
  username: string,
  email: string,
  password: string,
): UserObj {
  return {
    username: username,
    email: email,
    password: password,
    joinDate: new Date().toISOString(),
    avatar: null,
    isBlock: false,
  };
}

/**
 * Use an object to update the filed in a user object.
 * Return the newUser object.
 *
 * @param oldUser
 * @param fields
 * @throws
 */
export async function updateUserToBackEnd(
  oldUser: UserObj,
  fields: UserUpdateFieldType,
): Promise<UserObj> {
  let newUser = {
    username: fields.username ?? oldUser.username,
    email: fields.email ?? oldUser.email,
    joinDate: oldUser.joinDate,
    // Unchanged.
    avatar: fields.avatar === undefined ? oldUser.avatar : fields.avatar,
    isBlock: oldUser.isBlock

  };

  // If we need to change password.
  if (fields.password) {
    // @ts-ignore
    newUser.password = fields.password;
  }

  try {
    let response = await LAN_AXIOS.put(`${USER_API}/${oldUser.username}`, newUser);
    throwIsErrorResponse(response);
    return await getUserByUsername(newUser.username);
  } catch (e: unknown) {
    reThrowAxiosError(e);
  }
}

/**
 * Add user into array and store to local storage.
 * All the param must be verified before adding.
 *
 * @throw If user email already exist.
 * @param {string} username The username.
 * @param email
 * @param {string} password A password.
 * @throws
 */
export async function addNewUserToBackEnd(
  username: string,
  email: string,
  password: string
): Promise<UserObj> {
  try {
    const newUser = createUserObj(username, email, password);
    const response = await LAN_AXIOS.post(USER_API, newUser);

    throwIsErrorResponse(response);

    return response.data;
  } catch (e: unknown) {
    reThrowAxiosError(e);
  }
}

/**
 * Get all the users from backend.
 * @throws
 */
export async function getAllUsersFromBackEnd(): Promise<UserObj[]> {
  try {
    const response = await LAN_AXIOS.get(USER_API);
    throwIsErrorResponse(response);
    return response.data;
  } catch (e: unknown) {
    reThrowAxiosError(e);
  }
}

/**
 *  Use an email to remove a user form backend.
 *
 * @param {string} username
 * @throws Error When user list is empty or no user specific by email.
 */
export async function deleteUserByUsername(username: string): Promise<void> {
  try {
    const response = await LAN_AXIOS.delete(`${USER_API}/${username}`);
    throwIsErrorResponse(response);
  } catch (e: unknown) {
    reThrowAxiosError(e);
  }
}

// Is user set.
export function isLogIn(): boolean {
  return getFromLocalStorage(USER_KEY) !== null;
}


/**
 * Get a user object by email and password.
 * If failed, return null.
 *
 * @param username
 * @param password
 * @throws
 */
export async function getUserByUsernamePassword(
  username: string,
  password: string
): Promise<UserObj> {
  try {
    const response = await LAN_AXIOS.get(
      USER_SIGNIN, {
        params: {
          username: username,
          password: password
        }
      });

    throwIsErrorResponse(response);
    return response.data;
  } catch (e: unknown) {
    reThrowAxiosError(e);
  }
}

/**
 * Get a user object by email.
 * If failed, return null to the caller.
 *
 * @param {string} username
 * @returns {any|null}
 * @throws
 */
export async function getUserByUsername(username: string): Promise<UserObj> {
  try {
    const response = await LAN_AXIOS.get(`${USER_API}/select/${username}`);
    throwIsErrorResponse(response);
    return response.data;
  } catch (e: unknown) {
    reThrowAxiosError(e);
  }
}

/**
 * Set user to local storage. Always success.
 *
 * @param user
 * @throws
 */
export function setCurrentUser(user: UserObj): void {
  // Set a user obj to local storage.
  setToLocalStorage(USER_KEY, user);
}

/**
 * Get current user from local storage.
 * Could be null.
 */
export function getCurUserLocal(): null | UserObj {
  return getFromLocalStorage(USER_KEY);
}

/**
 * Remove the current user form local storage.
 */
export function removeCurUserLocal(): void {
  // Reset cur user.
  removeFromLocalStorage(USER_KEY);
}
