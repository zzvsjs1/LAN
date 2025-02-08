import { request, gql } from "graphql-request";
import { GQL_URL } from "./graphQLCore";
import { reThrowGqlError } from "./errorUtils";

export interface UserPerDayObj {
  date: string,
  count: number,
}

/**
 * Get the last 10 days user per day data.
 */
export async function getUserPerDayLast10Days(): Promise<UserPerDayObj[]> {
  try {
    const query = gql`
     {
       userPerDay {
        date
        count
      }
    }`;

    interface RData {
      userPerDay: UserPerDayObj[]
    }

    const data = await request<RData>(GQL_URL, query);
    return data.userPerDay;
  } catch (e: unknown) {
    reThrowGqlError(e);
  }
}
