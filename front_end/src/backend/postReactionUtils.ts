import { POST_REACTION_API } from "./backEndConfig";
import LAN_AXIOS from "./lanAxios";
import { reThrowAxiosError, throwIsErrorResponse } from "./errorUtils";
import { isSupportReaction } from "./isSupportReactions";

export interface PostReaction {
  id: number,
  username: string,
  postID: string,
  type: string,
}

export interface PostReactionSummary {
  like: number,
  dislike: number,
  curUserReact: PostReaction | null,
}

export function createEmptyPostReactionSummary(): PostReactionSummary {
  return {
    like: 0,
    dislike: 0,
    curUserReact: null,
  };
}

function createPostReactionForUpload(username: string, postID: string, type: string) {
  return {
    username: username,
    postID: postID,
    type: type,
  }
}

export async function addPostReaction(username: string, postID: string, type: string): Promise<PostReaction> {
  if (!isSupportReaction(type)) {
    throw new Error(`"${type}" is not a valid type of reaction.`);
  }

  try {
    // Create the post reaction object and post to express js server.
    const res = await LAN_AXIOS.post(`${POST_REACTION_API}`, createPostReactionForUpload(username, postID, type));

    throwIsErrorResponse(res);
    return res.data;
  } catch (e: unknown) {
    reThrowAxiosError(e);
  }
}

export async function getPostReactionSummary(username: string, postID: string): Promise<PostReactionSummary> {
  try {
    // Create the post reaction object and post to express js server.
    const res = await LAN_AXIOS.get(`${POST_REACTION_API}/summary`,
      { params: { username: username, postID: postID } }
    );

    throwIsErrorResponse(res);
    return res.data;
  } catch (e: unknown) {
    reThrowAxiosError(e);
  }
}

export async function updatePostReaction(reaction: PostReaction): Promise<PostReaction> {
  if (!isSupportReaction(reaction.type)) {
    throw new Error(`"${reaction.type}" is not a valid type of reaction.`);
  }

  try {
    const res = await LAN_AXIOS.put(`${POST_REACTION_API}/update`, reaction);
    throwIsErrorResponse(res);
    return res.data;
  } catch (e: unknown) {
    reThrowAxiosError(e);
  }
}

export async function deletePostReaction(reaction: PostReaction): Promise<void> {
  try {
    // Ues query parameter to delete the post reaction.
    const res = await LAN_AXIOS.delete(
      `${POST_REACTION_API}/delete`,
      {
        params: {
          username: reaction.username,
          postID: reaction.postID,
        }
      }
    );

    throwIsErrorResponse(res);
  } catch (e: unknown) {
    reThrowAxiosError(e);
  }
}