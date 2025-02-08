import { ReplyObj, updateReply } from "../../../backend/postAndReplyUtils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import isBadWord from "../../../backend/isBadWord";
import { toErrorPageException } from "../../../backend/errorUtils";
import TextDialog from "../../users/TextDialog";
import badWordsToTextStr from "../../postsAndReplies/badWordsToTextStr";
import Grid from "@mui/material/Grid";
import UserAvatar from "../../users/UserAvatar";
import ReplyReactionRow from "../../postsAndReplies/ReplyReactionRow";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import * as React from "react";
import { Paper } from "@mui/material";

type ReplyInnerRowProps = {
  reply: ReplyObj
}

export default function ReplyInnerRow({ reply }: ReplyInnerRowProps) {
  const [thisReply, setThisReply] = useState<ReplyObj>(reply);
  const [profanity, setProfanity] = useState<string[]>([]);
  const [showProfanityDialog, setShowProfanityDialog] = useState<boolean>(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);

  const navigate = useNavigate();

  // Get profanity.
  useEffect(() => setProfanity(() => isBadWord(thisReply.text)), [setProfanity, thisReply.text]);

  const deleteOrRestoreReply = async (value: boolean) => {
    try {
      await updateReply(thisReply.replyID, { isDelByAdmin: value });

      // Update value.
      const temp = { ...thisReply };
      temp.isDelByAdmin = value;
      setThisReply(temp);

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

      <Paper variant={'outlined'} sx={{ p: '1rem' }}>
        <Grid container spacing={2} sx={{ mt: '1rem' }}>
          <Grid item xs={1}>
            Reply ID:
          </Grid>
          <Grid item xs={3}>
            {thisReply.replyID}
          </Grid>
          <Grid item xs={2}>
            Create date:
          </Grid>
          <Grid item xs={3}>
            {new Date(thisReply.createDateTime).toISOString()}
          </Grid>
          <Grid item>
            Parent: {thisReply.parentReplyID ? thisReply.parentReplyID : 'No parent'}
          </Grid>
        </Grid>

        {/* Avatar and text. */}
        <Grid
          container
          spacing={2}
          sx={{ my: '1rem' }}
        >
          <Grid item xs={1} sx={{ py: 0 }}>
            <UserAvatar src={thisReply.user.avatar} />
          </Grid>
          <Grid
            item
            sx={{ wordWrap: 'break-word', py: 0 }}
            dangerouslySetInnerHTML={{ __html: thisReply.text }}
          />
        </Grid>

        {/* Reaction */}
        <ReplyReactionRow reply={thisReply} />

        {/* Button Group */}
        <Grid container columns={9} sx={{ mb: '1rem', alignItems: 'center' }}>
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
            {
              thisReply.isDelByAdmin
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
      </Paper>
    </>
  );
}