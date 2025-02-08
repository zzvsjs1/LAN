import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button, Form, FormGroup } from "react-bootstrap";
import FormAlert from "../../../components/FormAlert";
import React, { useRef, useState } from "react";
import { FORM_ERROR, MAX_POST_LEN } from "../common/variables";
import Image from "react-bootstrap/Image";
import UrlInputDialog from "../common/UrlInputDialog";
import { createPosTmpImgObj, postImgToTmpImg, tmpImgToPostImg } from "../../../backend/postReplyUtils";
import ReactQuill from "react-quill";

import './PostEditForm.scss';
import '../../../scss/LanQuill.scss';

type FormImgProps = {
  postImgID: string,
  url: string | undefined,
  delSelf: (id: string) => void,
};

/**
 * Display the image. Handle both file and url.
 *
 * @param id The id for an image.
 * @param url The url, could be undefined.
 * @param delSelf A function use to delete this image.
 */
function FormImg({ postImgID, url, delSelf }: FormImgProps) {
  return (
    <>
      <div
        className={'posting-form-img-wrapper'}
        onClick={() => delSelf(postImgID)}
      >
        <div className={'posting-form-img-overlay'}>
          <span className={'material-symbols-outlined posting-form-img-overlay-icon'}>
            close
          </span>
        </div>

        <Image
          className={'posting-form-img'}
          src={url}
        />
      </div>
    </>
  );
}

// Type in here.
type PostEditFormProps = {
  post: PostObj,
  setShowEditForm: React.Dispatch<React.SetStateAction<boolean>>,
  updatePost: (post: PostObj) => Promise<void>,
  refreshPostAndReply: () => Promise<void>,
}

type PostEditFormValues = {
  postEditText: string,
  images: PostImgTmpObj[],
  formError: any,
}

const TEXTAREA = 'postEditText';
const IMG_OBJ_KEY = 'images';

function PostEditForm({ post, setShowEditForm, updatePost, refreshPostAndReply }: PostEditFormProps) {
  const {
    control,
    handleSubmit,
    setError,
    getValues,
    setValue,
    clearErrors,
    formState: {
      errors,
    }
  } = useForm<PostEditFormValues>(
    {
      mode: 'onTouched',
      defaultValues: {
        postEditText: post.text,
        images: postImgToTmpImg(post.postImgs),
      },
    });

  const [showUrlInputDialog, setShowUrlInputDialog] = useState<boolean>(false);
  const [refreshThisComponent, setRefreshThisComponent] = useState<boolean>(false);

  // Similar to Post form.
  const addImageToImages = (image: string) => {
    const imgArray: PostImgTmpObj[] = getValues(IMG_OBJ_KEY);
    const newPostImage = createPosTmpImgObj(image, imgArray.length);

    imgArray.push(newPostImage);

    setValue(IMG_OBJ_KEY, imgArray);
  };

  const isFromRest = useRef<boolean>(false);

  const onSubmit: SubmitHandler<PostEditFormValues> = async (value: PostEditFormValues, e: any) => {
    e?.preventDefault();

    try {
      // Update text and images array.
      post.text = value.postEditText;

      // Update images.
      post.postImgs = tmpImgToPostImg(value.images, post.postID);

      // Update post.
      await updatePost(post);

      // Hide edit form and refresh this page.
      setShowEditForm(false);

      isFromRest.current = true;
      await refreshPostAndReply();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error.';
      setError(FORM_ERROR, { type: FORM_ERROR, message: msg });
    }
  };

  return (
    <>
      <UrlInputDialog
        showUrlInputDialog={showUrlInputDialog}
        setShowUrlInputDialog={setShowUrlInputDialog}
        addImageToImages={addImageToImages}
        allowEmpty={false}
      />

      <div className={'post-edit-form-container'}>
        <Form className={'post-edit-form'} onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Controller
              name={TEXTAREA}
              control={control}
              rules={{
                required: 'Post can not be empty.',
                maxLength: {
                  value: MAX_POST_LEN,
                  message: `Post length cannot exceed ${MAX_POST_LEN} characters.`,
                }
              }}
              render={({
                         field: { onChange, onBlur, value, ref, name },
                         fieldState: { invalid, isDirty, error }
                       }) =>
                (
                  <>
                    <Form.Control
                      as={'textarea'}
                      className={'lan-form-textarea-input hide-form'}
                      placeholder={'Enter text. Cannot be empty or more than 250 characters.'}
                      name={name}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      ref={ref}
                      isValid={(isDirty && !invalid) && !error}
                      isInvalid={(isDirty && invalid) || !!error}
                    />

                    <ReactQuill
                      theme={'snow'}
                      value={value}
                      onChange={
                        (value: string) => {
                          // Make sure we don't update the value when from reset.
                          if (isFromRest.current) {
                            isFromRest.current = false;
                            return;
                          }

                          setValue(TEXTAREA, value, { shouldValidate: true });
                        }}
                    />

                    {
                      error
                      &&
                      <Form.Control.Feedback
                        type="invalid"
                        className={'lan-form-feedback-posting'}
                      >
                        {error.message}
                      </Form.Control.Feedback>
                    }
                  </>
                )}
            />
          </FormGroup>

          <div className={'post-edit-form-image-part'}>
            {
              getValues(IMG_OBJ_KEY).map(
                ({ postImgID, url }) =>
                  <FormImg
                    key={postImgID}
                    postImgID={postImgID}
                    url={url}
                    delSelf={(selfId: string) => {
                      const imgArray: PostImgTmpObj[] = getValues(IMG_OBJ_KEY);
                      const afterDeleted: PostImgTmpObj[] = imgArray.filter(value => value.postImgID !== selfId);

                      // Reorder:
                      afterDeleted.forEach((value: PostImgTmpObj, index: number) => value.order = index);

                      // We need to set the data back.
                      setValue(IMG_OBJ_KEY, afterDeleted);
                      setRefreshThisComponent(!refreshThisComponent);
                    }}
                  />
              )
            }

            <div
              className={'posting-form-add-img-icon-wrapper'}
              title={'Add image'}
              onClick={() => setShowUrlInputDialog(true)}
            >
              <div className={'posting-form-add-img-icon-overlay'}>
                <span className={'material-symbols-outlined posting-form-img-overlay-icon'}>
                  add_circle
                </span>
              </div>
            </div>
          </div>

          {/* Form error alert. */}
          {errors && errors.formError && <FormAlert text={errors.formError.message} />}

          <div className={'post-edit-button-group'}>
            <Button
              name={`postEditFromSubmit-${post.postID}`}
              title={'Post'}
              type={'submit'}
              variant={'outline-primary'}
              className={'post-edit-form-btn'}
              onClick={() => clearErrors()}
            >
              Ok
            </Button>

            <Button
              name={'singlePostSubmit'}
              title={'Post'}
              type={'button'}
              variant={'outline-secondary'}
              className={'post-edit-form-btn'}
              onClick={() => setShowEditForm(false)}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}

export default PostEditForm;
