import { useEffect, useState } from "react";
import {
  addPostToBackend,
  createPostByTmpImgObj,
  delPostFromBackEnd,
  getAllPostsFromBackEnd,
  getAllRepliesFromBackEnd,
  updatePostToBackend
} from "../../../backend/postReplyUtils";
import { useReplyHook, UseReplyHookReturn } from "./useReplyHook";
import { useNavigate } from "react-router-dom";
import { toErrorPageException } from "../../../backend/toErrorPage";

export type UsePostHookReturn = {
  posts: PostObj[],
  addPost: (username: string, text: string, images: PostImgTmpObj[]) => Promise<void>,
  updatePost: (post: PostObj) => Promise<void>,
  delPost: (post: PostObj) => Promise<void>,
  refreshPostAndReply: () => Promise<void>,
  useReplyHook: UseReplyHookReturn,
};

/**
 * We use this hook to manage all the function and state
 * relate to the posts.
 * Otherwise, we need to put these codes into PostPage.
 * Which is bad.
 */
export function usePostHook(): UsePostHookReturn {
  const [posts, setPosts] = useState<PostObj[]>([]);
  const { replies, setReplies, ...rest } = useReplyHook();
  const navigate = useNavigate();

  // Fetch data. Only run once.
  useEffect(() => {
    async function fetchPosts() {
      try {
        const allPosts = await getAllPostsFromBackEnd();

        if (allPosts.length !== 0) {
          setPosts(allPosts);
        }
      } catch (e: unknown) {
        toErrorPageException(navigate, e);
      }
    }

    fetchPosts().catch(console.log);
    }, [navigate, setPosts]
  );

  /**
   *
   * @param username
   * @param text
   * @param images
   */
  const addPost = async (username: string, text: string, images: PostImgTmpObj[]) => {
    const newPost = createPostByTmpImgObj(username, text, images);

    // Add to backend.
    await addPostToBackend(newPost);

    // Refresh.
    await refreshPostAndReply();
  };

  const updatePost = async (post: PostObj) => {
    await updatePostToBackend(post);
    await refreshPostAndReply();
  };

  /**
   * Delete a post, and fetch the data again.
   *
   * @param post
   * @throws
   */
  const delPost = async (post: PostObj) => {
    // Delete the post.
    await delPostFromBackEnd(post);
    await refreshPostAndReply();
  }

  /**
   *  Fetch all the data again.
   *  @throws
   */
  const refreshPostAndReply = async () => {
    const posts = await getAllPostsFromBackEnd();
    const replies = await getAllRepliesFromBackEnd();

    setPosts(posts);
    setReplies(replies);
  }

  return {
    posts: posts,
    addPost: addPost,
    updatePost: updatePost,
    delPost: delPost,
    refreshPostAndReply: refreshPostAndReply,
    useReplyHook: {
      replies,
      setReplies,
      ...rest
    },
  };
}
