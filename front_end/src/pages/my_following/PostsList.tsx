import { Button } from "react-bootstrap";
import React, { useMemo } from "react";
import Post from "../posting/singlePost/Post";
import { usePostHook } from "../posting/common/usePostHook";

import './PostList.scss';

type PostsListProps = {
  user: UserObj,
  setShowPostList: React.Dispatch<React.SetStateAction<boolean>>
}

export default function PostsList({ user, setShowPostList }: PostsListProps) {
  const usePostHookReturn = usePostHook();

  // Only show the post which equal to the user.
  const postData = useMemo(() =>
      usePostHookReturn.posts.filter(post => post.username === user.username),
    [usePostHookReturn.posts, user]
  );

  return (
    <>
      <Button
        title={'back'}
        variant={'outline-primary'}
        className={'myfollowing-close-btn'}
        onClick={() => setShowPostList(false)}
      >
        Back to user list
      </Button>

      <h2 className={'mt-5 text-center text-break'}>
        Posts for {user.username}
      </h2>

      {/*  Show post in here. */}
      {
        postData.filter(post => post.username === user.username).length === 0
          ? <h4 className={'text-center mt-5'}>It looks like this user is very quiet...</h4>
          : postData
            .sort((a: PostObj, b: PostObj) => {
              return new Date(a.createDateTime).getTime() - new Date(b.createDateTime).getTime()
            })
            .map(post => {
              return (
                <div className={'postlist-post-container bg-light border'} key={post.postID}>
                  <Post post={post} usePostHookReturn={usePostHookReturn} />
                </div>
              )
            })
      }
    </>
  );
}