import { Button, Form, FormGroup } from "react-bootstrap";
import React, { useRef } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FORM_ERROR, MAX_POST_LEN } from "../common/variables";
import FormAlert from "../../../components/FormAlert";
import { isValidPostAndReplyValue, verifyPostAndReply } from "../../../common/userProfileFromValidation";
import ReactQuill from "react-quill";

import './ReplyEditForm.scss';
import '../../../scss/LanQuill.scss';

type ReplyEditFormProps = {
  reply: ReplyObj,
  updateReply: (reply: ReplyObj) => Promise<void>,
  setShowEditForm: React.Dispatch<React.SetStateAction<boolean>>,
}

type FormValues = {
  replyText: string,
  formError: any,
};

function ReplyEditForm({ reply, updateReply, setShowEditForm }: ReplyEditFormProps) {
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
        replyText: reply.text,
      },
    });

  const isFromRest = useRef<boolean>(false);
  const quill = useRef<ReactQuill | null>(null);

  const onSubmit: SubmitHandler<FormValues> = async (value: FormValues, e?: any) => {
    e?.preventDefault();

    try {
      // Change text.
      reply.text = value.replyText;

      // Update and refresh.
      await updateReply(reply);

      // Hide.
      setShowEditForm(false);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error.';
      setError(FORM_ERROR, { type: FORM_ERROR, message: msg });
    }
  }

  return (
    <div className={'reply-edit-form-wrapper'}>
      <Form className={'reply-edit-form'} onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Controller
            name={'replyText'}
            control={control}
            rules={{
              validate: (value: string) => {
                if (quill.current !== null && typeof quill.current.getEditor === 'function') {
                  const text = quill.current.getEditor().getText();
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
                        if (isFromRest.current) {
                          isFromRest.current = false;
                          return;
                        }

                        setValue('replyText', value, { shouldValidate: true });
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

        <div className={'reply-edit-button-group'}>
          <Button
            name={'replySubmit'}
            title={'Post'}
            type={'submit'}
            variant={'outline-primary'}
            className={'reply-form-btn me-3'}
            onClick={() => clearErrors()}
          >
            Update
          </Button>

          <Button
            title={'Cancel'}
            type={'button'}
            variant={'outline-primary'}
            className={'reply-form-btn'}
            onClick={() => setShowEditForm(false)}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default ReplyEditForm;
