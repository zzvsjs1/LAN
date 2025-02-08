import * as React from "react";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import UserAvatar from "../users/UserAvatar";
import Button from "@mui/material/Button";
import { ReplyObj, updateReply } from "../../backend/postAndReplyUtils";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import isBadWord from "../../backend/isBadWord";
import ReplyReactionRow from "./ReplyReactionRow";
import TextDialog from "../users/TextDialog";
import badWordsToTextStr from "./badWordsToTextStr";
import { toErrorPageException } from "../../backend/errorUtils";
import { useNavigate } from "react-router-dom";

type ReplyProps = {
  reply: ReplyObj,
  refresh: () => Promise<void>,
  showDivide: boolean
}

export default function Reply({ reply, refresh, showDivide }: ReplyProps) {
  const [profanity, setProfanity] = useState<string[]>([]);
  const [showProfanityDialog, setShowProfanityDialog] = useState<boolean>(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Check profanity
    setProfanity(() => isBadWord(reply.text));
  }, [setProfanity, reply.text]);

  const deleteOrRestoreReply = async (value: boolean) => {
    try {
      // Set value depend on the input.
      await updateReply(reply.replyID, { isDelByAdmin: value });
      await refresh();

      // Only show dialog when we delete the post.
      if (value) {
        setShowSuccessDialog(true);
      }
    } catch (e: unknown) {
      toErrorPageException(navigate, e);
    }
  };

  return (
    <>
      {
        showProfanityDialog
        &&
        <TextDialog
          title={'Reply profanity'}
          text={badWordsToTextStr(profanity)}
          setShow={setShowProfanityDialog}
        />
      }

      {
        showSuccessDialog
        &&
        <TextDialog
          title={'Delete reply'}
          text={'Delete reply successful.'}
          setShow={setShowSuccessDialog}
        />
      }

      {
        showDivide
        &&
        <Divider />
      }

      <Grid container spacing={2} sx={{ mt: '1rem' }}>
        <Grid item xs={1}>
          Reply ID:
        </Grid>
        <Grid item xs={3}>
          {reply.replyID}
        </Grid>
        <Grid item xs={2}>
          Create date:
        </Grid>
        <Grid item xs={3}>
          {new Date(reply.createDateTime).toISOString()}
        </Grid>
        <Grid item>
          Parent: {reply.parentReplyID ? reply.parentReplyID : 'No parent'}
        </Grid>
      </Grid>

      {/* Avatar and text. */}
      <Grid
        container
        spacing={2}
        sx={{ my: '1rem' }}
      >
        <Grid item xs={1} sx={{ py: 0 }}>
          <UserAvatar src={reply.user.avatar} />
        </Grid>
        <Grid
          item
          sx={{ wordWrap: 'break-word', py: 0 }}
          dangerouslySetInnerHTML={{ __html: reply.text }}
        />
      </Grid>

      {/* Reaction */}
      <ReplyReactionRow reply={reply} />

      {/* Button Group */}
      <Grid container columns={9} sx={{ mb: '1rem' }}>
        <Grid item sx={{ mr: '3rem' }} xs={2}>
          Profanity status: {
          profanity.length !== 0
            ?
            <Typography
              variant={'body1'}
              component={'span'}
              sx={{ color: (theme) => theme.palette.error.light }}>
              Contain
            </Typography>
            :
            <Typography
              variant={'body1'}
              component={'span'}
              sx={{ color: (theme) => theme.palette.success.light }}>
              Not found
            </Typography>
        }
        </Grid>

        <Grid item xs={3}>
          <Button
            variant={'contained'}
            color={'primary'}
            disabled={profanity.length === 0}
            onClick={() => setShowProfanityDialog(true)}
          >
            Check profanity
          </Button>
        </Grid>

        <Grid item xs={3}>
          {/* Show different button relate to is deleted. */}
          {
            reply.isDelByAdmin
              ?
              <Button
                variant={'contained'}
                color={'success'}
                onClick={() => deleteOrRestoreReply(false)}
              >
                Restore
              </Button>
              :
              <Button
                variant={'contained'}
                color={'secondary'}
                onClick={() => deleteOrRestoreReply(true)}
              >
                Delete
              </Button>
          }
        </Grid>
      </Grid>
    </>
  );
}