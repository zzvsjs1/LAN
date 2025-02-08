import { PostObj } from "../../backend/postAndReplyUtils";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { REACTION_LIKE } from "../../backend/reactionKey";
import Divider from "@mui/material/Divider";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import * as React from "react";
import { useMemo } from "react";

type PostReactionRowProps = {
  post: PostObj
}

// The row used to display post reaction.
export default function PostReactionRow({ post } : PostReactionRowProps) {
  const likeCount = useMemo(() => {
    return post.postReactions.filter(value => value.type === REACTION_LIKE).length;
  }, [post]);

  return (
    <Grid container sx={{ mb: '1rem' }}>
      <Grid sx={{ m: 0, display: 'flex' }} item>
        <Typography
          sx={{ ml: '0.25rem', mr: '0.25rem', display: 'flex' }}
          display={'inline'}
          variant={'body1'}
          component={'span'}
        >
          <ThumbUpIcon />
          <Typography  display={'inline'} variant={'body1'} component={'span'} sx={{ ml: '0.2rem' }}>
            {likeCount}
          </Typography>
        </Typography>

        <Divider sx={{ mr: '0.25rem' }} orientation={'vertical'}/>

        <Typography sx={{ mr: '0.25rem', display: 'flex' }} display={'inline'} variant={'body1'}>
          <ThumbDownAltIcon />

          <Typography  display={'inline'} variant={'body1'} component={'span'} sx={{ ml: '0.2rem' }}>
            {post.postReactions.length - likeCount}
          </Typography>
        </Typography>
      </Grid>
    </Grid>
  );
}