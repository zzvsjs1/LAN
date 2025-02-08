import React, { useContext, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import Image from "react-bootstrap/Image";
import FormAlert from "../../components/FormAlert";
import { CurUserContext } from "../../common/CurUserContext";
import { MAX_POST_LEN, TEXTAREA, FORM_ERROR } from "./common/variables";
import { createPosTmpImgObj } from "../../backend/postReplyUtils";
import PostSuccessDialog from "./PostSuccessDialog";
import UrlInputDialog from "./common/UrlInputDialog";
import ReactQuill from 'react-quill';
import { isValidPostAndReplyValue, verifyPostAndReply } from "../../common/userProfileFromValidation";

import './PostForm.scss';
import '../../scss/LanQuill.scss';

type FormImgProps = {
  postImgID: string,
  url: string,
  delSelf: (id: string) => void,
};

function FormImg({ postImgID, url, delSelf }: FormImgProps) {
  return (
    <>
      <div
        className={'posting-form-img-wrapper'}
        title={url}
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
          alt={`User upload ${url}.`}
        />
      </div>
    </>
  );
}

type PostFormProps = {
  addPost: (username: string, text: string, images: PostImgTmpObj[]) => Promise<void>,
}

type FormValues = {
  text: string,
  // Ignore, just for the error.
  formError: any,
  imagesObj: PostImgTmpObj[],
};

const IMG_OBJ_KEY = 'imagesObj';

/**
 * This form is used to allow the user post
 * a post.
 *
 */
function PostForm({ addPost }: PostFormProps) {
  // Use hook form library.
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    getValues,
    clearErrors,
    reset,
    formState: {
      errors,
    }
  } = useForm<FormValues>(
    {
      mode: 'onTouched',
      defaultValues: {
        text: '',
        imagesObj: [],
      },
    });

  const { curUser } = useContext(CurUserContext);

  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);
  const [showUrlInputDialog, setShowUrlInputDialog] = useState<boolean>(false);
  const [refreshThisComponent, setRefreshThisComponent] = useState<boolean>(false);

  /**
   * Add an image to form images value.
   * Convert all the images value into PostImgObj,
   * @param image A image string.
   */
  const addImageToArr = (image: string) => {
    // Create PostImgObj.
    const imgArray: PostImgTmpObj[] = getValues(IMG_OBJ_KEY)
    const newPostImage = createPosTmpImgObj(image, imgArray.length);

    // Append to the end.
    imgArray.push(newPostImage);

    // Set value back to form.
    setValue(IMG_OBJ_KEY, imgArray);
  }

  const isFromRest = useRef<boolean>(false);
  const quill = useRef<ReactQuill | null>(null);

  // The actual submit function.
  const onSubmit: SubmitHandler<FormValues> = async (value: FormValues, e: any) => {
    e?.preventDefault();

    try {
      // Add new post
      const images: PostImgTmpObj[] = getValues(IMG_OBJ_KEY);

      for (let i = 0; i < images.length; ++i) {
        console.assert(i === images[i].order);
      }

      // Add new post to backend and refresh.
      // @ts-ignore
      await addPost(curUser.username, value.text, images);

      // Don't forget to clean up.
      reset();

      // Reset form.
      isFromRest.current = true;
      setShowSuccessDialog(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error.';
      setError(FORM_ERROR, { type: FORM_ERROR, message: msg });
    }
  }

  return (
    <>
      <PostSuccessDialog
        title={'Success'}
        body={'Post successful'}
        show={showSuccessDialog}
        setShow={setShowSuccessDialog}
      />

      <UrlInputDialog
        showUrlInputDialog={showUrlInputDialog}
        setShowUrlInputDialog={setShowUrlInputDialog}
        addImageToImages={addImageToArr}
        allowEmpty={false}
      />

      <div className={'posting-form-wrapper'}>

        <Form className={'posting-form'} onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name={TEXTAREA}
            control={control}
            rules={{
              validate: (value: string) => {
                // Better to user pure text not html.
                // We cannot remove all the html tags by regex.
                if (quill.current !== null && typeof quill.current.getEditor === 'function') {
                  const text: string = quill.current.getEditor().getText();
                  return verifyPostAndReply(text, MAX_POST_LEN);
                }

                // Second solution, not good.
                return isValidPostAndReplyValue(value, MAX_POST_LEN);
              }
            }}
            render={({
                       field: { onChange, value, ref, name },
                       fieldState: { invalid, isDirty, error }
                     }) =>
              (
                <>
                  <Form.Control
                    as={'textarea'}
                    className={'lan-form-textarea-input hide-form'}
                    name={name}
                    id={name}
                    onChange={onChange}
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
                    ref={(ref) => quill.current = ref}
                  />

                  {
                    error
                    &&
                    <Form.Control.Feedback type="invalid" className={'lan-form-feedback-posting'}>
                      {error.message}
                    </Form.Control.Feedback>
                  }
                </>
              )}
          />

          <div className={'posting-form-image-part'}>
            {
              getValues(IMG_OBJ_KEY).map(
                ({ postImgID, url }) =>
                  <FormImg
                    key={postImgID}
                    postImgID={postImgID}
                    url={url}
                    delSelf={(selfId: string) => {
                      const imgArray: PostImgTmpObj[] = getValues(IMG_OBJ_KEY);
                      const afterDeleted = imgArray.filter(value => value.postImgID !== selfId);

                      // Reorder
                      afterDeleted.forEach((value: PostImgTmpObj, index: number) => value.order = index);

                      // Set value back.
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

          <Button
            name={'postFormBtn'}
            title={'Post'}
            type={'submit'}
            variant={'outline-primary'}
            className={'posting-form-post-btn'}
            onClick={() => clearErrors()}
          >
            Post
          </Button>
        </Form>
      </div>
    </>
  )
}

export default PostForm;
