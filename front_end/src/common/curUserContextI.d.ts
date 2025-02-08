type UserUpdateFieldType = {
  username?: string,
  email?: string,
  password?: string,
  avatar?: string | null,
}

type CurUserContextI = {
  curUser: UserObj | null,
  isSignIn: () => boolean,
  reFetchUser: () => Promise<void>,
  signIn: (username: string, password: string) => Promise<void>,
  signOut: () => void,
  updateCurUserByField: (field: UserUpdateFieldType) => Promise<void>,
  deleteCurUserAccount: () => Promise<void>,
}

type CurrentUserProviderProps = {
  children: JSX.Element,
}
