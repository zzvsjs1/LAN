import { useContext, useState } from "react";
import { Container } from "react-bootstrap";
import PostEditForm from "./PostEditForm";
import PostAvatar from "../common/PostAvatar";
import DeleteDialog from "../../common/DeleteDialog";
import ReplyForm from "../reply/ReplyForm";
import { CurUserContext } from "../../../common/CurUserContext";
import Reply from "../reply/Reply";
import PostImage from "./PostImage";
import { UsePostHookReturn } from "../common/usePostHook";
import PostReaction from "./PostReaction";
import { Navigate } from "react-router-dom";

import './Post.scss';
import '../scss/PostReplyCommon.scss';

type PostProps = {
  post: PostObj,
  usePostHookReturn: UsePostHookReturn,
}

function Post({ post, usePostHookReturn }: PostProps) {
  const {
    delPost,
    refreshPostAndReply,
    updatePost,
    useReplyHook: {
      replies,
      addReply,
    }
  } = usePostHookReturn;

  const { curUser } = useContext(CurUserContext);

  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [showDelDialog, setShowDelDialog] = useState<boolean>(false);
  const [showReplyForm, setShowReplyForm] = useState<boolean>(false);

  return (
    <Container data-testid={`post-container-${post.postID}`} className={'single-post-container'}>

      {/* Handle logic error. */}
      {
        !post.user
        &&
        <Navigate to={'/error'} replace={true} state={{ info: 'Post missing user object.' }} />
      }

      {
        showEditForm
        &&
        <PostEditForm
          post={post}
          setShowEditForm={setShowEditForm}
          updatePost={updatePost}
          refreshPostAndReply={refreshPostAndReply}
        />
      }

      <DeleteDialog
        title={'Are you sure?'}
        body={'Do you want to delete this post?'}
        showReplyDelDialog={showDelDialog}
        setShowReplyDelDialog={setShowDelDialog}
        callBack={() => delPost(post)}
      />

      {
        post.isDelByAdmin
        &&
        <div className={'post-block'}>
          <h2>
            This post has been deleted by the admin
          </h2>
          <div className={'post-block-small-text'}>
            Username: {post.username}
          </div>
        </div>
      }

      {
        !showEditForm
        &&
        !post.isDelByAdmin
        &&
        <div className={'single-post-inner-container'}>
          <div className={'post-avatar-container'}>
            {
              post.user
              &&
              <PostAvatar src={post.user.avatar} />
            }
          </div>

          <div className={'post-content-container'}>
            <div className={'post-userinfo'}>
              <div className={'post-username'}>
                {post.user ? post.user.username : 'Unknown'}
              </div>
            </div>

            <div className={'post-inner-content'}>
              <div data-testid={`postText-${post.postID}`}
                   className={'post-text-area'}
                   dangerouslySetInnerHTML={{ __html: post.text }}
              />
            </div>

            <div className={'post-images-container'}>
              {/* Map images */}
              {post.postImgs.map(({ postImgID, url }) => <PostImage key={postImgID} src={url} />)}
            </div>

            <div className={'post-tools'}>
              <div className={'reply-time'}>
                {new Date(post.createDateTime).toLocaleString('en-AU')}
              </div>


              {/* Post reaction */}
              <PostReaction post={post} />


              {/* Only show when user id equal current. */}
              {
                post.user
                &&
                curUser!.username
                &&
                post.username === curUser!.username
                &&
                <div
                  data-testid={`postEdit-${post.postID}`}
                  className={'post-tool-text'}
                  onClick={() => setShowEditForm(true)}
                >
                  Edit
                </div>
              }

              {/* Only show when user id equal current. */}
              {
                post.user
                &&
                curUser!.username
                &&
                post.username === curUser!.username
                &&
                <div
                  data-testid={`postDelete-${post.postID}`}
                  className={'post-tool-text'}
                  onClick={() => setShowDelDialog(true)}
                >
                  Delete
                </div>
              }

              <div
                data-testid={`postReply-${post.postID}`}
                className={'post-tool-text'}
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                Reply
              </div>
            </div>
          </div>

          {
            showReplyForm
            &&
            <ReplyForm
              post={post}
              setShowReplyForm={setShowReplyForm}
              addReply={addReply}
              parentReply={null}
            />
          }
        </div>
      }

      {/* Reply in here. */}
      {/*
        Actually, the sorting algorithm is very bad.
        Because create a new object in compare function
        may cause GC work hard...

        But I still choose this way is because we don't
        if A2 will ISO string for Date.
        If so, we can change this part to normal string
        compare function.
      */}
      <div className={'reply-container'}>
        {
          !post.isDelByAdmin
          &&
          replies
            .filter((eachReply: ReplyObj) =>
              eachReply.parentReplyID === null && eachReply.postID === post.postID
            )
            .sort(
              (a: ReplyObj, b: ReplyObj) =>
                new Date(b.createDateTime).getTime() - new Date(a.createDateTime).getTime()
            )
            .map((eachReply) =>
              <Reply
                key={eachReply.replyID}
                reply={eachReply}
                parentPost={post}
                useReplyHook={usePostHookReturn.useReplyHook}
              />
            )
        }
      </div>
    </Container>
  );
}

export default Post;
