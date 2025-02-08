import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Container, Paper } from '@mui/material';
import Post from './Post';
import { useCallback, useEffect, useState } from "react";
import { getAllPosts, PostObj } from "../../backend/postAndReplyUtils";
import { useNavigate } from "react-router-dom";
import { toErrorPageException } from "../../backend/errorUtils";

export default function PostAndReplyPanel() {
  const [posts, setPosts] = useState<PostObj[]>([]);

  const navigate = useNavigate();

  const refresh = useCallback(async () => {
    try {
      // Change the post by backend data.
      setPosts(await getAllPosts())
    } catch (e: unknown) {
      toErrorPageException(navigate, e);
    }
  }, [setPosts, navigate]);

  useEffect(() => {
    // Only call once.
    refresh().catch(console.log);
  }, [refresh]);

  return (
    <Box sx={{ p: '5rem' }}>
      <Container maxWidth={'xl'}>
        <Typography sx={{ m: '0 auto 2rem auto' }} variant={'h2'}>
          All posts and replies
        </Typography>

        {
          posts.length === 0
          &&
          <Paper sx={{ p: '3rem' }}>
            <Typography variant={'h4'} align={'center'}>
              No post in backend.
            </Typography>
          </Paper>
        }

        {/* Add post to here. */}
        {
          posts.sort((a, b) =>
            new Date(b.createDateTime).getTime() - new Date(a.createDateTime).getTime()
          )
            .map(post => (
              <Box key={post.postID} sx={{ mb: '2rem' }}>
                <Paper
                  sx={{
                    display: 'flex',
                    px: '2.5rem',
                    flexDirection: 'column'
                  }}
                >
                  <Post post={post} refresh={refresh} displayReply={true} />
                </Paper>
              </Box>
            ))
        }
      </Container>
    </Box>
  );
}