import { Container } from "react-bootstrap";
import PostForm from "./PostForm";
import PostArea from "./PostArea";
import { usePostHook } from "./common/usePostHook";

/**
 * Let's think about the structure for our posting page.
 *
 * At the top will be a rich text editor. Which allows the user to enter
 * text, also upload the image.
 *
 * Below this editor are post components.
 * If post is empty, it will not display.
 *
 * Therefore, the structure will be:
 *
 * Posting page:
 *     Form
 *         Area
 *             Post
 *                 Reply
 */
function PostingPage() {
  const { addPost, ...rest } = usePostHook();

  return (
    <div className={'posting-page-wrapper'}>
      <Container>
        <PostForm addPost={addPost} />
        <PostArea usePostHookReturn={{ addPost, ...rest }} />
      </Container>
    </div>
  );
}

export default PostingPage;
