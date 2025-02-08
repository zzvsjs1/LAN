import LAN_AXIOS from "./lanAxios";
import { reThrowAxiosError, throwIsErrorResponse } from "./errorUtils";
import { isSupportReaction } from "./isSupportReactions";
import { REPLY_REACTION_API } from "./backEndConfig";

export interface ReplyReaction {
  id: number,
  username: string,
  replyID: string,
  type: string,
}

export interface ReplyReactionSummary {
  like: number,
  dislike: number,
  curUserReact: ReplyReaction | null,
}

export function createEmptyReplyReactionSummary(): ReplyReactionSummary {
  return {
    like: 0,
    dislike: 0,
    curUserReact: null,
  };
}

function createReplyReactionForUpload(username: string, replyID: string, type: string) {
  return {
    username: username,
    replyID: replyID,
    type: type,
  };
}

export async function addReplyReaction(username: string, replyID: string, type: string): Promise<ReplyReaction> {
  if (!isSupportReaction(type)) {
    throw new Error(`"${type}" is not a valid type of reaction.`);
  }

  try {
    // Create the post reaction object and post to express js server.
    const res = await LAN_AXIOS.post(
      `${REPLY_REACTION_API}`,
      createReplyReactionForUpload(username, replyID, type)
    );

    throwIsErrorResponse(res);
    return res.data;
  } catch (e: unknown) {
    reThrowAxiosError(e);
  }
}

export async function getReplyReactionSummary(username: string, replyID: string) {
  try {
    // Create the post reaction object and post to express js server.
    const res = await LAN_AXIOS.get(`${REPLY_REACTION_API}/summary`,
      { params: { username: username, replyID: replyID } }
    );

    throwIsErrorResponse(res);
    return res.data;
  } catch (e: unknown) {
    reThrowAxiosError(e);
  }
}

export async function updateReplyReaction(reaction: ReplyReaction): Promise<ReplyReaction> {
  if (!isSupportReaction(reaction.type)) {
    throw new Error(`"${reaction.type}" is not a valid type of reaction.`);
  }

  try {
    const res = await LAN_AXIOS.put(`${REPLY_REACTION_API}/update`, reaction);
    throwIsErrorResponse(res);
    return res.data;
  } catch (e: unknown) {
    reThrowAxiosError(e);
  }
}

export async function deleteReplyReaction(reaction: ReplyReaction): Promise<void> {
  try {
    // Ues query parameter to delete the post reaction.
    const res = await LAN_AXIOS.delete(
      `${REPLY_REACTION_API}/delete`,
      {
        params: {
          username: reaction.username,
          replyID: reaction.replyID,
        }
      }
    );

    throwIsErrorResponse(res);
  } catch (e: unknown) {
    reThrowAxiosError(e);
  }
}
