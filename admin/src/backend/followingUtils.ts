import { request, gql } from "graphql-request";
import { GQL_URL } from "./graphQLCore";
import { reThrowGqlError } from "./errorUtils";

export interface FollowedAndCountObj {
  username: string
  count: number,
}

export async function getTopTenFollowedAndCount(): Promise<FollowedAndCountObj[]> {
  try {
    const query = gql`
    {
      getTopTenFollowed {
        username
        count
      }
    }`;

    interface RData {
      getTopTenFollowed: FollowedAndCountObj[]
    }

    const data = await request<RData>(GQL_URL, query);
    return data.getTopTenFollowed;
  } catch (e: unknown) {
    reThrowGqlError(e);
  }
}
