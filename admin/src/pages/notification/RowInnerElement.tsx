import { SubscriptionObj, SubscriptionType } from "../../common/SubscriptionContext";
import Typography from "@mui/material/Typography";
import ReplyInnerRow from "./rowInner/ReplyInnerRow";
import UserInnerRow from "./rowInner/UserInnerRow";
import PostInnerRow from "./rowInner/PostInnerRow";
import { ErrorMessageRow } from "./rowInner/ErrorMessageRow";
import * as React from "react";

type RowInnerElementProps = {
  singleState: SubscriptionObj,
}

/**
 * Show different row depend on the state value.
 * @param singleState
 */
export default function RowInnerElement({ singleState }: RowInnerElementProps) {
  switch (singleState.type) {
    case SubscriptionType.REPLY_REACTION_ISSUE: {
      return (
        <>
          {/* Display title, reply and user. */}
          <Typography variant={'h6'} sx={{ my: '0.5rem' }}>
            Reply:
          </Typography>
          <ReplyInnerRow reply={singleState.reply!} />

          <Typography variant={'h6'} sx={{ my: '1rem' }}>
            User:
          </Typography>
          <UserInnerRow user={singleState.reply!.user!} />
        </>
      );
    }
    case SubscriptionType.POST_REACTION_ISSUE: {
      return (
        <>
          {/* Display title, post and user. */}
          <Typography variant={'h6'} sx={{ my: '1rem' }}>
            Post:
          </Typography>
          <PostInnerRow post={singleState.post!} />

          <Typography variant={'h6'} sx={{ my: '1rem' }}>
            User:
          </Typography>
          <UserInnerRow user={singleState.post!.user!} />
        </>
      );
    }
    // Show error message.
    case SubscriptionType.ERROR: {
      return (
        <ErrorMessageRow
          msg={
            singleState.error
              ? singleState.error.message
              : 'Unknown error.'
        }
        />
      );
    }
    default: {
      throw new Error('No this type.');
    }
  }
}
