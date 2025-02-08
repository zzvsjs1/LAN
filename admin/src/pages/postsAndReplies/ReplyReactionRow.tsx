import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { REACTION_LIKE } from "../../backend/reactionKey";
import Divider from "@mui/material/Divider";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import * as React from "react";
import { ReplyObj } from "../../backend/postAndReplyUtils";
import { useMemo } from "react";

type ReplyReactionRowProps = {
  reply: ReplyObj
}

export default function ReplyReactionRow({ reply } : ReplyReactionRowProps) {
  const likeCount = useMemo(() => {
    return reply.replyReactions.filter(value => value.type === REACTION_LIKE).length;
  }, [reply]);

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
            {reply.replyReactions.length - likeCount}
          </Typography>
        </Typography>
      </Grid>
    </Grid>
  );
}