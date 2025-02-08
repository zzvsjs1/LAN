import { PostObj, updatePost } from "../../../backend/postAndReplyUtils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import isBadWord from "../../../backend/isBadWord";
import { toErrorPageException } from "../../../backend/errorUtils";
import { Paper } from "@mui/material";
import TextDialog from "../../users/TextDialog";
import badWordsToTextStr from "../../postsAndReplies/badWordsToTextStr";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import UserAvatar from "../../users/UserAvatar";
import PostImageList from "../../postsAndReplies/PostImageList";
import PostReactionRow from "../../postsAndReplies/PostReactionRow";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import * as React from "react";

type PostInnerRowProps = {
  post: PostObj
}

export default function PostInnerRow({ post }: PostInnerRowProps) {
  const [thisPost, setThisPost] = useState<PostObj>(post);
  const [profanity, setProfanity] = useState<string[]>([]);
  const [showProfanityDialog, setShowProfanityDialog] = useState<boolean>(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Check profanity
    setProfanity(() => isBadWord(thisPost.text));
  }, [setProfanity, thisPost.text]);

  const deleteOrRestorePost = async (value: boolean) => {
    try {
      // We update the post to backend, and refresh the list.
      await updatePost(thisPost.postID, { isDelByAdmin: value });

      const temp = { ...thisPost };
      temp.isDelByAdmin = value;
      setThisPost(temp);

      // Only show dialog when we delete the post.
      if (value) {
        setShowSuccessDialog(true);
      }
    } catch (e: unknown) {
      toErrorPageException(navigate, e);
    }
  };

  return (
    <Paper variant={'outlined'}>
      {
        showProfanityDialog
        &&
        <TextDialog
          title={'Post profanity'}
          text={badWordsToTextStr(profanity)}
          setShow={setShowProfanityDialog}
        />
      }

      {
        showSuccessDialog
        &&
        <TextDialog
          title={'Delete post'}
          text={'Delete post successful.'}
          setShow={setShowSuccessDialog}
        />
      }

      <Box
        sx={{
          display: 'flex',
          px: '2.5rem',
          flexDirection: 'column'
        }}
      >
        {/* The post status */}
        <Grid container spacing={2} columns={10} sx={{ mt: '1rem' }}>
          <Grid item xs={1}>
            Post ID:
          </Grid>
          <Grid item xs={3}>
            {thisPost.postID}
          </Grid>
          <Grid item xs={2}>
            Create date:
          </Grid>
          <Grid item xs={3}>
            {new Date(thisPost.createDateTime).toISOString()}
          </Grid>
        </Grid>

        {/* Avatar and text. */}
        <Grid container spacing={2} sx={{ my: '1rem' }}>
          <Grid item xs={1} sx={{ py: 0 }}>
            <UserAvatar src={thisPost.user.avatar} />
          </Grid>
          <Grid
            item
            sx={{ wordWrap: 'break-word', py: 0 }}
            dangerouslySetInnerHTML={{ __html: thisPost.text }}
          />
        </Grid>

        {/* Image */}
        <Grid container spacing={2} sx={{ mb: '1rem' }}>
          <Grid item xs={1} />
          <Grid sx={{ m: 0 }} item>
            <PostImageList images={thisPost.postImgs} />
          </Grid>
        </Grid>

        {/* Reaction */}
        <PostReactionRow post={thisPost} />

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
              thisPost.isDelByAdmin
                ?
                <Button
                  variant={'contained'}
                  color={'success'}
                  onClick={() => deleteOrRestorePost(false)}
                >
                  Restore
                </Button>
                :
                <Button
                  variant={'contained'}
                  color={'secondary'}
                  onClick={() => deleteOrRestorePost(true)}
                >
                  Delete
                </Button>
            }
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}