import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import * as React from "react";
import UserAvatar from "../users/UserAvatar";
import PostImageList from "./PostImageList";
import Reply from "./Reply";
import { PostObj, ReplyObj, updatePost } from "../../backend/postAndReplyUtils";
import TextDialog from "../users/TextDialog";
import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import isBadWord from "../../backend/isBadWord";
import PostReactionRow from "./PostReactionRow";
import badWordsToTextStr from "./badWordsToTextStr";
import { toErrorPageException } from "../../backend/errorUtils";
import { useNavigate } from "react-router-dom";

type PostProps = {
  post: PostObj,
  refresh: () => Promise<void>,
  displayReply: boolean
}

export default function Post({ post, refresh, displayReply }: PostProps) {
  const [profanity, setProfanity] = useState<string[]>([]);
  const [showProfanityDialog, setShowProfanityDialog] = useState<boolean>(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Check profanity.
    setProfanity(() => isBadWord(post.text));
  }, [setProfanity, post.text]);

  const deleteOrRestorePost = async (value: boolean) => {
    try {
      // We update the post to backend, and refresh the list.
      await updatePost(post.postID, { isDelByAdmin: value });
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

      {/* The post status */}
      <Grid container spacing={2} columns={10} sx={{ mt: '1rem' }}>
        <Grid item xs={1}>
          Post ID:
        </Grid>
        <Grid item xs={3}>
          {post.postID}
        </Grid>
        <Grid item xs={2}>
          Create date:
        </Grid>
        <Grid item xs={3}>
          {new Date(post.createDateTime).toISOString()}
        </Grid>
      </Grid>

      {/* Avatar and text. */}
      <Grid container spacing={2} sx={{ my: '1rem' }}>
        <Grid item xs={1} sx={{ py: 0 }}>
          <UserAvatar src={post.user.avatar} />
        </Grid>
        <Grid
          item
          sx={{ wordWrap: 'break-word', py: 0 }}
          dangerouslySetInnerHTML={{ __html: post.text }}
        />
      </Grid>

      {/* Image */}
      <Grid container spacing={2} sx={{ mb: '1rem' }}>
        <Grid item xs={1} />
        <Grid sx={{ m: 0 }} item>
          <PostImageList images={post.postImgs} />
        </Grid>
      </Grid>

      {/* Reaction */}
      <PostReactionRow post={post} />

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
              May contain
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
            post.isDelByAdmin
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

      {/* Replies */}
      {
        displayReply
        &&
        post.replies.sort((a: ReplyObj, b: ReplyObj) =>
          new Date(b.createDateTime).getTime() - new Date(a.createDateTime).getTime()
        ).map(reply => <Reply key={reply.replyID} reply={reply} refresh={refresh} showDivide={true} />)
      }
    </>
  )
}