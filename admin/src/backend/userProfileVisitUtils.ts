import { request, gql } from "graphql-request";
import { GQL_URL } from "./graphQLCore";
import { reThrowGqlError } from "./errorUtils";

export interface UserProfileVisitCountObj {
  username: string,
  count: number,
}

// Get the top 10 user profile visit data.
export async function getTopTenProfileVisitUserAndCount(): Promise<UserProfileVisitCountObj[]> {
  try {
    const query = gql`
    {
      topTenProfileVisit {
        username
        count
      }
    }`;

    interface RData {
      topTenProfileVisit: UserProfileVisitCountObj[]
    }

    const data = await request<RData>(GQL_URL, query);
    return data.topTenProfileVisit;
  } catch (e: unknown) {
    reThrowGqlError(e);
  }
}
