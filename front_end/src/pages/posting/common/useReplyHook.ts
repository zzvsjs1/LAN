import React, { useEffect, useState } from "react";
import {
  addReplyToBackend,
  createReplyObj,
  delReplyToBackEnd,
  getAllRepliesFromBackEnd,
  updateReplyToBackEnd
} from "../../../backend/postReplyUtils";
import { toErrorPageException } from "../../../backend/toErrorPage";
import { useNavigate } from "react-router-dom";

export type UseReplyHookReturn = {
  replies: ReplyObj[],
  setReplies: React.Dispatch<React.SetStateAction<ReplyObj[]>>,
  addReply: (username: string,
             text: string,
             parentPostId: string,
             parentReplyId: string | null,
             level: number) => Promise<void>,
  delReply: (delReply: ReplyObj) => Promise<void>,
  updateReply: (reply: ReplyObj) => Promise<void>,
  refreshReply: () => Promise<void>,
};

/**
 * This hook is used to manage the state for all replies.
 */
export function useReplyHook(): UseReplyHookReturn {
  const [replies, setReplies] = useState<ReplyObj[]>([]);
  const navigate = useNavigate();

  // Fetch replies.
  useEffect(() => {
      const refresh = async () => {
        try {
          const allReplies = await getAllRepliesFromBackEnd();
          // Avoid duplicate set.
          if (allReplies.length !== 0) {
            setReplies(allReplies);
          }
        } catch (e: unknown) {
          toErrorPageException(navigate, e);
        }
      };

      refresh().catch(console.log);
    }, [navigate, setReplies]
  );

  /**
   *
   * @param username
   * @param text
   * @param parentPostId
   * @param parentReplyId
   * @param parentReplyLevel
   */
  const addReply = async (username: string,
                          text: string,
                          parentPostId: string,
                          parentReplyId: string | null,
                          parentReplyLevel: number) => {
    const newReply = createReplyObj(username, text, parentPostId, parentReplyId, parentReplyLevel);

    // Add a new reply to backend first.
    await addReplyToBackend(newReply);
    await refreshReply();
  };

  // Delete single reply.
  const delReply = async (delReply: ReplyObj) => {
    await delReplyToBackEnd(delReply);
    await refreshReply();
  };

  const updateReply = async (reply: ReplyObj) => {
    await updateReplyToBackEnd(reply);
    await refreshReply();
  }

  // Just refresh the reply array.
  const refreshReply = async () => {
    const replies = await getAllRepliesFromBackEnd();
    setReplies(replies);
  };

  return {
    replies: replies,
    setReplies: setReplies,
    addReply: addReply,
    delReply: delReply,
    updateReply: updateReply,
    refreshReply: refreshReply,
  };
}
