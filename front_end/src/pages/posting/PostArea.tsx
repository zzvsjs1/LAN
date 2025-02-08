import { Container } from "react-bootstrap";
import React from "react";
import Post from "./singlePost/Post";
import { UsePostHookReturn } from "./common/usePostHook";

import './PostArea.scss';

type PostAreaProps = {
  usePostHookReturn: UsePostHookReturn
};

function PostArea({ usePostHookReturn }: PostAreaProps) {
  const { posts } = usePostHookReturn;

  return (
    <Container className={'post-area-container'}>
      {
        posts
          // Sort by date.
          .sort(
            (a: PostObj, b: PostObj) =>
              new Date(b.createDateTime).getTime() - new Date(a.createDateTime).getTime()
          )
          .map((post: PostObj) =>
            <Post
              key={post.postID}
              post={post}
              usePostHookReturn={usePostHookReturn}
            />)
      }
    </Container>
  );
}

export default PostArea;
