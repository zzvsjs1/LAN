import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FORM_ERROR, MAX_POST_LEN, TEXTAREA } from "../common/variables";
import { Button, Form, FormGroup } from "react-bootstrap";
import ReactQuill from "react-quill";
import FormAlert from "../../../components/FormAlert";
import React, { useContext, useRef } from "react";
import { CurUserContext } from "../../../common/CurUserContext";
import { isValidPostAndReplyValue, verifyPostAndReply } from "../../../common/userProfileFromValidation";

import './ReplyForm.scss';
import '../../../scss/LanQuill.scss';

type ReplyFormProps = {
  post: PostObj,
  setShowReplyForm: React.Dispatch<React.SetStateAction<boolean>>,
  addReply: (username: string,
             text: string,
             parentPostId: string,
             parentReplyId: string | null,
             level: number) => Promise<void>,
  parentReply: ReplyObj | null
}

type FormValues = {
  text: string,
  formError: any,
}

function ReplyForm({ post, setShowReplyForm, addReply, parentReply }: ReplyFormProps) {
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    clearErrors,
    formState: {
      errors,
    }
  } = useForm<FormValues>(
    {
      mode: 'onTouched',
      defaultValues: {
        text: '',
      },
    });

  // @ts-ignore
  const { curUser } = useContext(CurUserContext);

  const isFromRest = useRef<boolean>(false);
  const quill = useRef<ReactQuill | null>(null);

  const onSubmit: SubmitHandler<FormValues> = async (value: FormValues, e: any) => {
    e?.preventDefault();

    try {
      // Can be null.
      const parentReplyId = parentReply ? parentReply.replyID : null;
      const parentReplyLevel = parentReply ? parentReply.level : 0;

      // Add reply to backend.
      // @ts-ignore
      await addReply(curUser.username, value.text, post.postID, parentReplyId, parentReplyLevel);

      // Hide this form.
      setShowReplyForm(false);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error.';
      setError(FORM_ERROR, { type: FORM_ERROR, message: msg, });
    }
  }

  return (
    <div className={'reply-form-wrapper'}>

      <Form className={'reply-edit-form'} onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Controller
            name={TEXTAREA}
            control={control}
            rules={{
              validate: (value: string) => {
                if (quill.current !== null && typeof quill.current.getEditor === 'function') {
                  const text: string = quill.current.getEditor().getText();
                  return verifyPostAndReply(text, MAX_POST_LEN);
                }

                // Second solution, not good.
                return isValidPostAndReplyValue(value, MAX_POST_LEN);
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
                    placeholder={`Enter text. Cannot be empty or more than ${MAX_POST_LEN} characters.`}
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
        </FormGroup>

        {/* Form error alert. */}
        {errors && errors.formError && <FormAlert text={errors.formError.message} />}

        <div className={'reply-button-group'}>
          <Button
            title={'Post'}
            type={'submit'}
            variant={'outline-primary'}
            className={'reply-form-btn me-3'}
            onClick={() => clearErrors()}
          >
            Ok
          </Button>

          <Button
            title={'Cancel'}
            type={'button'}
            variant={'outline-primary'}
            className={'reply-form-btn'}
            onClick={() => setShowReplyForm(false)}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default ReplyForm;
