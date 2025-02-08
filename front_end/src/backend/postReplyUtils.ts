import getUniqueID from "./getUniqueID";
import LAN_AXIOS from "./lanAxios";
import { POST_API, REPLY_API } from "./backEndConfig";
import { reThrowAxiosError, throwIsErrorResponse } from "./errorUtils";


// Post


// export function urlArrToPostImgArr(images: string[], postID: string): PostImgObj[] {
//   return images.map((image: string, index: number) => createPostImgObj(image, index, postID));
// }

export function postImgToTmpImg(postImgs: PostImgObj[]): PostImgTmpObj[] {
  return postImgs.map(value => createPosTmpImgObj(value.url, value.order, value.postImgID));
}

export function tmpImgToPostImg(postTmpImgs: PostImgTmpObj[], postID: string): PostImgObj[] {
  return postTmpImgs.map(value => createPostImgObj(value.url, value.order, postID));
}

export function createPosTmpImgObj(
  url: string,
  order: number,
  postImgID?: string
) : PostImgTmpObj {
  return {
    postImgID: postImgID ?? getUniqueID(),
    url: url,
    order: order,
  };
}

export function createPostImgObj(url: string, order: number, postID: string): PostImgObj {
  return {
    postImgID: getUniqueID(),
    postID: postID,
    url: url,
    order: order,
  };
}

export function createPostByTmpImgObj(
  username: string,
  text: string,
  images: PostImgTmpObj[],
  user?: UserObj
): PostObj {
  const id = getUniqueID();
  return {
    postID: id,
    username: username,
    createDateTime: new Date().toISOString(),
    text: text,
    postImgs: tmpImgToPostImg(images, id),
    isDelByAdmin: false,
    user: user,
  };
}

export async function getAllPostsFromBackEnd(): Promise<PostObj[]> {
  try {
    const response = await LAN_AXIOS.get(POST_API);
    throwIsErrorResponse(response);
    return response.data;
  } catch (e: unknown) {
    reThrowAxiosError(e);
  }
}

export async function addPostToBackend(post: PostObj): Promise<PostObj> {
  try {
     const response = await LAN_AXIOS.post(POST_API, post);
     throwIsErrorResponse(response);
     return response.data;
  } catch (e: unknown) {
    reThrowAxiosError(e);
  }
}

export async function updatePostToBackend(post: PostObj): Promise<void> {
  try {
    const response = await LAN_AXIOS.put(`${POST_API}/${post.postID}`, post);
    throwIsErrorResponse(response);
  } catch (e: unknown) {
    reThrowAxiosError(e);
  }
}

export async function delPostFromBackEnd(post: PostObj): Promise<void> {
  try {
    const response = await LAN_AXIOS.delete(`${POST_API}/postID/${post.postID}`);
    throwIsErrorResponse(response);
  } catch (e: unknown) {
    reThrowAxiosError(e);
  }
}


// Reply

/**
 * Create a new reply object.
 *
 * @param {string} username
 * @param {string} text
 * @param {string} parentPostId
 * @param {string | null} parentReplyId
 * @param {Number} parentReplyLevel
 * @param user
 * @returns {ReplyObj}
 */
export function createReplyObj(
  username: string,
  text: string,
  parentPostId: string,
  parentReplyId: string | null,
  parentReplyLevel: number,
  user?: UserObj
): ReplyObj {
  return {
    replyID: getUniqueID(),
    username: username,
    createDateTime: new Date().toISOString(),
    text: text,
    postID: parentPostId,
    parentReplyID: parentReplyId,
    level: parentReplyLevel + 1,
    user: user,
    isDelByAdmin: false,
  };
}

export async function getAllRepliesFromBackEnd(): Promise<ReplyObj[]> {
  try {
    const response = await LAN_AXIOS.get(REPLY_API);
    throwIsErrorResponse(response);
    return response.data;
  } catch (e: unknown) {
    reThrowAxiosError(e);
  }
}

export async function addReplyToBackend(reply: ReplyObj): Promise<ReplyObj> {
  try {
    const response = await LAN_AXIOS.post(REPLY_API, reply);
    throwIsErrorResponse(response);
    return response.data;
  } catch (e: unknown) {
    reThrowAxiosError(e);
  }
}

export async function delReplyToBackEnd(reply: ReplyObj): Promise<void> {
  try {
    const response = await LAN_AXIOS.delete(`${REPLY_API}/${reply.replyID}`);
    throwIsErrorResponse(response);
  } catch (e: unknown) {
    reThrowAxiosError(e);
  }
}

export async function updateReplyToBackEnd(reply: ReplyObj): Promise<void> {
  try {
    const response = await LAN_AXIOS.put(`${REPLY_API}/${reply.replyID}`, reply);
    throwIsErrorResponse(response);
  } catch (e: unknown) {
    reThrowAxiosError(e);
  }
}
