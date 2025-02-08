import { ButtonGroup, Button } from "react-bootstrap";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createEmptyPostReactionSummary, getPostReactionSummary,
  PostReactionSummary,
  updatePostReaction,
  deletePostReaction,
  addPostReaction
} from "../../../backend/postReactionUtils";
import { toErrorPageException } from "../../../backend/toErrorPage";
import { REACTION_DISLIKE, REACTION_LIKE } from "../../../backend/isSupportReactions";
import { CurUserContext } from "../../../common/CurUserContext";

import './PostReaction.scss';

type PostReactionProps = {
  post: PostObj,
};

/**
 * The reaction button group.
 * We use this for post and reply.
 *
 * @param state
 */
export default function PostReaction({ post }: PostReactionProps) {
  const [reactionSummary, setReactionSummary] = useState<PostReactionSummary>(createEmptyPostReactionSummary());
  const { curUser } = useContext<CurUserContextI>(CurUserContext);
  const navigate = useNavigate();

  const refresh = useCallback(async () => {
    try {
      const summary = await getPostReactionSummary(curUser!.username, post.postID);
      setReactionSummary(summary);
    } catch (e: unknown) {
      toErrorPageException(navigate, e);
    }
  }, [setReactionSummary, curUser, navigate, post.postID]);

  // Fetch data.
  useEffect(() => {
    refresh().catch(console.log);
  }, [refresh]);

  // Avoid data race.
  const isFetching = useRef<boolean>(false);

  const doReaction = (reactionBtnKey: string) => {
    if (isFetching.current) {
      return;
    }

    // Change the current in sync thread.
    isFetching.current = true;

    const internal = async () => {
      // Now we need to do something.
      try {

        // If this user already make a reaction.
        if (reactionSummary.curUserReact) {
          const curUserReact = reactionSummary.curUserReact;

          // If two keys are equal. We just delete.
          if (reactionBtnKey === curUserReact.type) {
            await deletePostReaction(curUserReact);
          } else {
            // Otherwise, we update the type.
            curUserReact.type = reactionBtnKey;
            await updatePostReaction(curUserReact);
          }
        } else {
          // No reaction, we add a new one.
          await addPostReaction(curUser!.username, post.postID, reactionBtnKey);
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
        data-testid={`post-like-btn-${post.postID}`}
        variant={'outline-primary'}
        type={'button'}
        className={'reactions-item-btn'}
        active={reactionSummary.curUserReact ? reactionSummary.curUserReact.type === REACTION_LIKE : false}
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
        data-testid={`post-dislike-btn-${post.postID}`}
        variant={'outline-primary'}
        type={'button'}
        className={'reactions-item-btn'}
        active={reactionSummary.curUserReact ? reactionSummary.curUserReact.type === REACTION_DISLIKE : false}
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
  );
}