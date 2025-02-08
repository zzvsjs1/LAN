import { createContext, useState } from "react";
import {
  deleteUserByUsername,
  getCurUserLocal,
  getUserByUsernamePassword,
  isLogIn,
  removeCurUserLocal,
  setCurrentUser,
  updateUserToBackEnd
} from "../backend/userUtils";

// The actual context. We assert not null.
export const CurUserContext = createContext<CurUserContextI>(null!);

/**
 * The global user context. Use in the whole application.
 *
 * @param children A react dom.
 */
export function CurrentUserProvider({ children }: CurrentUserProviderProps) {
  const [curUser, setCurUser] = useState(getCurUserLocal());

  // Manually fetch the user.
  const fetchUserFromBackEnd = async () => {
    setCurUser(getCurUserLocal());
  }

  /**
   * Sign in a user, sync to backend.
   *
   * @param username
   * @param password
   */
  const signIn = async (username: string, password: string) => {
    const user = await getUserByUsernamePassword(username, password);

    // If user been blocked.
    if (user.isBlock) {
      throw new Error(`User "${user.username}" is blocked.`);
    }

    // Set user to local storage and hook.
    setCurrentUser(user);
    setCurUser(user);
  };

  /**
   * Remove the current user from local storage and hook.
   */
  const signOut = () => {
    if (!isLogIn()) {
      throw new Error("No user sign in. Logical error.");
    }

    removeCurUserLocal();
    setCurUser(null);
  }

  /**
   * Call the backend update user function.
   * Do error checking.
   *
   * @param field
   */
  const updateCurUserByField = async (field: UserUpdateFieldType) => {
    if (curUser === null) {
      throw new Error('User is null. Logical error.');
    }

    // Old user reference.
    // First create new user object.
    const newUser = await updateUserToBackEnd(curUser, field);
    setCurrentUser(newUser);
    setCurUser(newUser);
  }

  /**
   * Remove a user form backend.
   * Include all posts and replies.
   * The child replies also need to be removed.
   */
  const deleteCurUserAccount = async () => {
    if (curUser === null) {
      throw new Error('User is null. Logical error.');
    }

    const needToDelUsername = curUser.username;

    // Then sign out and remove from local storage.
    await deleteUserByUsername(needToDelUsername);
    signOut();
  }

  const wrapper: CurUserContextI = {
    curUser: curUser,
    isSignIn: () => curUser !== null,
    reFetchUser: fetchUserFromBackEnd,
    signIn: signIn,
    signOut: signOut,
    updateCurUserByField: updateCurUserByField,
    deleteCurUserAccount: deleteCurUserAccount,
  };

  return (
    <CurUserContext.Provider value={wrapper}>
      {children}
    </CurUserContext.Provider>
  );
}
