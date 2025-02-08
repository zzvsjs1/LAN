type PostObj = {
  postID: string,
  username: string,
  createDateTime: string,
  text: string,
  postImgs: PostImgObj[],
  isDelByAdmin: boolean,
  user?: UserObj,
};

type ReplyObj = {
  replyID: string,
  username: string,
  createDateTime: string,
  text: string,
  postID: string,
  parentReplyID: string | null,
  level: number
  isDelByAdmin: boolean
  user?: UserObj,
};

type PostImgObj = {
  postImgID: string,
  postID: string,
  url: string,
  order: number,
}

type PostImgTmpObj = {
  postImgID: string,
  url: string,
  order: number,
}
