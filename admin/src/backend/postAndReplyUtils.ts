import { User } from "./userUtils";
import { request, gql } from "graphql-request";
import { GQL_URL } from "./graphQLCore";
import { reThrowGqlError } from "./errorUtils";
import { PostReactionObj, ReplyReactionObj } from "./reactionUtils";

// Post, reply object.
export interface PostObj {
  postID: string,
  username: string,
  createDateTime: string,
  text: string,
  postImgs: PostImgObj[],
  isDelByAdmin: boolean,
  user: User,
  postReactions: PostReactionObj[],
  replies: ReplyObj[],
}

export interface ReplyObj {
  replyID: string,
  username: string,
  createDateTime: string,
  text: string,
  postID: string,
  parentReplyID: string | null,
  level: number,
  isDelByAdmin: boolean,
  replyReactions: ReplyReactionObj[],
  user: User,
}

export interface PostImgObj {
  postImgID: string,
  postID: string,
  url: string,
  order: number,
}

export interface PostInput {
  postID?: string,
  username?: string,
  createDateTime?: string,
  text?: string,
  postImgs?: PostImgObj[],
  isDelByAdmin?: boolean,
}

export interface ReplyInput {
  replyID?: string,
  username?: string,
  createDateTime?: string,
  text?: string,
  postID?: string,
  parentReplyID?: string | null,
  level?: number,
  isDelByAdmin?: boolean,
}

// Get all the fields for reply.
export const REPLY_RETURN_QUERY = `
  replyID
  username
  createDateTime
  text
  postID
  parentReplyID
  level
  isDelByAdmin
  replyReactions {
    id
    username
    replyID
    type
  }
  user {
    username
    email
    password
    avatar
    joinDate
    isBlock
  }
`;

// Get all the fields for post.
export const POST_RETURN_QUERY = `
    postID
    username
    createDateTime
    text
    postImgs {
      postImgID
      postID
      url
      order
    }
    isDelByAdmin
    postReactions {
        id
        username
        postID
        type
    }
    user {
      username
      email
      password
      avatar
      joinDate
      isBlock
    }
    replies {
      ${REPLY_RETURN_QUERY}
    }
`;

export async function getAllPosts(): Promise<PostObj[]> {
  try {

    // Super long query.
    // We will fetch all the fields.
    // We need all this data to display.
    const query = gql`
    {
      allPosts {
        ${POST_RETURN_QUERY}
      }
    }`;

    interface RData {
      allPosts: PostObj[]
    }

    const data = await request<RData>(GQL_URL, query);
    return data.allPosts;
  } catch (e: unknown) {
    reThrowGqlError(e);
  }
}

export async function updatePost(postID: string, input: PostInput): Promise<PostObj> {
  try {
    const query = gql`
      mutation UpdatePost($postID: String, $input: PostInput) {
        updatePost(
            postID: $postID,
            input: $input
        ) {
           ${POST_RETURN_QUERY}
        }
      }
    `;

    interface RData {
      updatePost: PostObj
    }

    const variables = { postID: postID, input: input };
    const data = await request<RData>(GQL_URL, query, variables);
    return data.updatePost;
  } catch (e: unknown) {
    reThrowGqlError(e);
  }
}

export async function updateReply(replyID: string, input: ReplyInput): Promise<ReplyObj> {
  try {
    const query = gql`
      mutation UpdateReply($replyID: String, $input: ReplyInput) {
        updateReply(
            replyID: $replyID,
            input: $input
        ) {
           ${REPLY_RETURN_QUERY}
        }
      }
    `;

    interface RData {
      updateReply: ReplyObj
    }

    const variables = { replyID: replyID, input: input };
    const data = await request<RData>(GQL_URL, query, variables);
    return data.updateReply;
  } catch (e: unknown) {
    reThrowGqlError(e);
  }
}