import { request, gql } from "graphql-request";
import { GQL_URL } from "./graphQLCore";
import { reThrowGqlError } from "./errorUtils";

export interface User {
  username: string,
  email: string,
  password: string,
  joinDate: string,
  avatar: string | null,
  isBlock: boolean,
}

export interface UserInput {
  username?: string,
  email?: string,
  password?: string,
  joinDate?: string,
  avatar?: string | null,
  isBlock?: boolean,
}

const USER_FIELDS = `
        username
        email
        password
        avatar
        joinDate
        isBlock
`;

// Return all user from backend.
export async function getAllUsers(): Promise<User[]> {
  try {
    const query = gql`
    {
      allUser {
        ${USER_FIELDS}
      }
    }`;

    interface RData {
      allUser: User[]
    }

    const data = await request<RData>(GQL_URL, query);
    return data.allUser;
  } catch (e: unknown) {
    reThrowGqlError(e);
  }
}

// Update a user by username and a field.
export async function updateUser(username: string, newUser: UserInput): Promise<User> {
  try {
    const query = gql`
      mutation UpdateUser($username: String, $newUser: UserInput) {
        updateUser(
            username: $username,
            newUser: $newUser
        ) {
           ${USER_FIELDS}
        }
      }
    `;

    interface RData {
      updateUser: User
    }

    const variables = { username: username, newUser: newUser };
    const data = await request<RData>(GQL_URL, query, variables);
    return data.updateUser;
  } catch (e: unknown) {
    reThrowGqlError(e);
  }
}