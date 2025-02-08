import { useContext, useState } from "react";
import PostAvatar from "../common/PostAvatar";
import ReplyEditForm from "./ReplyEditForm";
import DeleteDialog from "../../common/DeleteDialog";
import ReplyForm from "./ReplyForm";
import { CurUserContext } from "../../../common/CurUserContext";
import { UseReplyHookReturn } from "../common/useReplyHook";
import { Navigate } from "react-router-dom";
import ReplyReaction from "./ReplyReaction";

import './Reply.scss';
import '../scss/PostReplyCommon.scss';

type FormValues = {
  reply: ReplyObj,
  parentPost: PostObj,
  useReplyHook: UseReplyHookReturn,
}

function Reply({ reply, parentPost, useReplyHook }: FormValues) {
  const { replies, addReply, delReply, updateReply } = useReplyHook;

  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [showReplyDelDialog, setShowReplyDelDialog] = useState<boolean>(false);
  const [showReplyForm, setShowReplyForm] = useState<boolean>(false);

  // @ts-ignore
  const { curUser } = useContext(CurUserContext);

  const isCurUser = (curUser: UserObj | null, replyUser: UserObj | null) => {
    return curUser && replyUser && curUser.username === replyUser.username;
  };

  return (
    <>
      {/* Do error checking. */}
      {
        !reply.user
        &&
        <Navigate to={'/error'} replace={true} state={{ info: 'Reply missing user object.' }} />
      }

      {
        showEditForm
        &&
        <ReplyEditForm
          updateReply={updateReply}
          reply={reply}
          setShowEditForm={setShowEditForm} />
      }

      <DeleteDialog
        title={'Are you sure?'}
        body={'Do you want to delete this reply?'}
        showReplyDelDialog={showReplyDelDialog}
        setShowReplyDelDialog={setShowReplyDelDialog}
        callBack={() => delReply(reply)}
      />

      {
        reply.isDelByAdmin
        &&
        <div className={'post-block'}>
          <h2>
            This reply has been deleted by the admin
          </h2>
          <div className={'post-block-small-text'}>
            Username: {reply.username}
          </div>
        </div>
      }

      {
        (!reply.isDelByAdmin && !showEditForm && reply.user)
        &&
        <div className={'reply-inner-container'}>
          <div className={'reply-avatar-container'}>
            <PostAvatar src={reply.user.avatar} />
          </div>

          <div className={'post-content-container'}>
            <div className={'post-userinfo'}>
              <div className={'post-username'}>
                {reply.user.username ?? 'Unknown user'}
              </div>
            </div>

            <div className={'reply-inner-content'}>
              <div
                data-testid={`replyText-${reply.replyID}`}
                className={'post-text-area'}
                dangerouslySetInnerHTML={{ __html: reply.text }}
              />
            </div>

            <div className={'post-tools'}>
              <div className={'reply-time'}>
                {new Date(reply.createDateTime).toLocaleString('en-AU')}
              </div>

              {/* Reply reaction. */}
              <ReplyReaction reply={reply} />

              {
                isCurUser(curUser, reply.user)
                &&
                <div
                  data-testid={`replyEdit-${reply.replyID}`}
                  className={'post-tool-text'}
                  onClick={() => setShowEditForm(true)}
                >
                  Edit
                </div>
              }

              {
                isCurUser(curUser, reply.user)
                &&
                <div
                  data-testid={`replyDelete-${reply.replyID}`}
                  className={'post-tool-text'}
                  onClick={() => setShowReplyDelDialog(true)}>
                  Delete
                </div>
              }

              {/* Not allow reply to more than or equal to level 2.*/}
              {
                reply.level < 2
                &&
                <div
                  data-testid={`replyReply-${reply.replyID}`}
                  className={'post-tool-text'}
                  onClick={() => setShowReplyForm(!showReplyForm)}
                >
                  Reply
                </div>
              }
            </div>
          </div>

          {
            showReplyForm
            &&
            <ReplyForm
              post={parentPost}
              parentReply={reply}
              addReply={addReply}
              setShowReplyForm={setShowReplyForm}
            />
          }

          {
            replies
              .filter((eachReply: ReplyObj) => eachReply.parentReplyID === reply.replyID)
              .sort(
                (a: ReplyObj, b: ReplyObj) =>
                  new Date(b.createDateTime).getTime() - new Date(a.createDateTime).getTime()
              )
              .map((eachReply: ReplyObj) =>
                <Reply
                  key={eachReply.replyID}
                  reply={eachReply}
                  parentPost={parentPost}
                  useReplyHook={useReplyHook}
                />
              )
          }
        </div>
      }
    </>
  );
}

export default Reply;
