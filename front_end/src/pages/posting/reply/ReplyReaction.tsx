import { Button, ButtonGroup } from "react-bootstrap";
import { REACTION_DISLIKE, REACTION_LIKE } from "../../../backend/isSupportReactions";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { CurUserContext } from "../../../common/CurUserContext";
import { useNavigate } from "react-router-dom";
import { toErrorPageException } from "../../../backend/toErrorPage";
import {
  createEmptyReplyReactionSummary,
  getReplyReactionSummary,
  ReplyReactionSummary,
  deleteReplyReaction, updateReplyReaction, addReplyReaction
} from "../../../backend/replyReactionUtils";

import './ReplyReaction.scss';

type ReplyReactionProps = {
  reply: ReplyObj,
}

/**
 * The code are similar to post reaction.
 *
 * Why not separate the logic and reuse the component?
 *
 * Because it's too difficult. The method of data fetching is different.
 * Further abstraction made the code more
 * difficult to understand, and we eventually gave up the separation design.
 *
 * @param reply
 */
export default function ReplyReaction({ reply }: ReplyReactionProps) {
  const [reactionSummary, setReactionSummary] = useState<ReplyReactionSummary>(createEmptyReplyReactionSummary());
  const { curUser } = useContext<CurUserContextI>(CurUserContext);
  const navigate = useNavigate();

  const refresh = useCallback(async () => {
    try {
      const summary = await getReplyReactionSummary(curUser!.username, reply.replyID);
      setReactionSummary(summary);
    } catch (e: unknown) {
      toErrorPageException(navigate, e);
    }
  }, [setReactionSummary, curUser, navigate, reply.replyID]);

  useEffect(() => {
    refresh().catch(console.log);
  }, [refresh]);

  const isFetching = useRef<boolean>(false);

  // Same logic with post reaction.
  const doReaction = (reactionBtnKey: string) => {
    if (isFetching.current) {
      return;
    }

    // Get lock.
    isFetching.current = true;

    const internal = async () => {
      try {
        if (reactionSummary.curUserReact) {
          const curUserReact = reactionSummary.curUserReact;

          if (reactionBtnKey === curUserReact.type) {
            await deleteReplyReaction(curUserReact);
          } else {
            curUserReact.type = reactionBtnKey;
            await updateReplyReaction(curUserReact);
          }
        } else {
          await addReplyReaction(curUser!.username, reply.replyID, reactionBtnKey);
        }

        await refresh();
      } catch (e: unknown) {
        toErrorPageException(navigate, e);
      }
    }

    internal().finally(() => isFetching.current = false);
  };

  return (
    <ButtonGroup size={'sm'} className={'reactions-container'}>
      {/* Like */}
      <Button
        data-testid={`reply-like-btn-${reply.replyID}`}
        variant={'outline-primary'}
        type={'button'}
        className={'reactions-item-btn'}
        active={!!reactionSummary.curUserReact && reactionSummary.curUserReact.type === REACTION_LIKE}
        onClick={() => doReaction(REACTION_LIKE)}
      >
        <span className={"me-1"}>
          {reactionSummary.like}
        </span>
        <span className={"material-symbols-outlined reactions-item-icon"}>
          thumb_up
        </span>
      </Button>

      <div className="vr" />

      {/* Dislike */}
      <Button
        data-testid={`reply-dislike-btn-${reply.replyID}`}
        variant={'outline-primary'}
        type={'button'}
        className={'reactions-item-btn'}
        active={!!reactionSummary.curUserReact && reactionSummary.curUserReact.type === REACTION_DISLIKE}
        onClick={() => doReaction(REACTION_DISLIKE)}
      >
        <span className={"me-1"}>
          {reactionSummary.dislike}
        </span>
        <span className={"material-symbols-outlined reactions-item-icon"}>
          thumb_down
        </span>
      </Button>
    </ButtonGroup>
  )
}