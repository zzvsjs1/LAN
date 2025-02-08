import { request, gql } from "graphql-request";
import { GQL_URL } from "./graphQLCore";
import { reThrowGqlError } from "./errorUtils";

// The reaction type.
export interface PostReactionObj {
  id: number,
  username: string,
  postID: string,
  type: string,
}

export interface ReplyReactionObj {
  id: number,
  username: string,
  replyID: string,
  type: string,
}

export async function getAllPostReactions(): Promise<PostReactionObj[]> {
  try {
    const query = gql`
    {
      allPostReactions {
        id
        username
        postID
        type
      }
    }`;

    interface RData {
      allPostReactions: PostReactionObj[]
    }

    const data = await request<RData>(GQL_URL, query);
    return data.allPostReactions;
  } catch (e: unknown) {
    reThrowGqlError(e);
  }
}

export async function getAllReplyReactions(): Promise<ReplyReactionObj[]> {
  try {
    const query = gql`
    {
      allReplyReactions {
        id
        username
        replyID
        type
      }
    }`;

    interface RData {
      allReplyReactions: ReplyReactionObj[]
    }

    const data = await request<RData>(GQL_URL, query);
    return data.allReplyReactions;
  } catch (e: unknown) {
    reThrowGqlError(e);
  }
}
