import Modal from 'react-bootstrap/Modal';
import { Form, Button } from 'react-bootstrap';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import React from "react";
import { isURL } from "../../../common/userProfileFromValidation";
import FormAlert from "../../../components/FormAlert";

type UrlInputDialogProps = {
  showUrlInputDialog: boolean,
  setShowUrlInputDialog: (arg: boolean) => void,
  addImageToImages: (arg: string) => void,
  allowEmpty: boolean,
};

type FormValues = {
  url: string,
  formError: any,
}

function UrlInputDialog({
    showUrlInputDialog,
    setShowUrlInputDialog,
    addImageToImages,
    allowEmpty,
  }: UrlInputDialogProps) {
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: {
      errors,
    }
  } = useForm<FormValues>(
    {
      mode: 'onTouched',
      defaultValues: {
        url: '',
      },
    });

  const leaveThisDialog = () => {
    // Don't forget to clean up all the fields.
    reset();
    setShowUrlInputDialog(false)
  };

  // Submit the image later.
  const onSubmit: SubmitHandler<FormValues> = (data: FormValues, event: any) => {
    event?.preventDefault();

    try {
      addImageToImages(data.url);
      leaveThisDialog();
    } catch (e: unknown) {
      const msg = e instanceof Error ?  e.message : 'Unknown error.';
      setError('formError', { type: 'formError', message: msg });
    }
  };

  return (
    <>
      <Modal
        show={showUrlInputDialog}
        centered={true}
        size={'lg'}
        onHide={() => leaveThisDialog()}>
        <Modal.Header closeButton>
          <Modal.Title>
            URL Input
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form id={'submit-form'} onSubmit={handleSubmit(onSubmit)}>
            <Form.Group>
              <Controller
                name={'url'}
                control={control}
                rules={{
                  validate: value => {
                    if (value.length === 0 && allowEmpty) {
                      return true;
                    }

                    return isURL(value) ? true : 'No a valid Url.';
                  },
                }}
                render={({
                           field: { onChange, onBlur, value, ref, name },
                           fieldState: { invalid, isDirty, error }
                         }) =>
                  (
                    <>
                      <Form.Control
                        type={'text'}
                        placeholder={allowEmpty ? 'Enter Url or leave empty.' : 'Enter URL.'}
                        name={name}
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        ref={ref}
                        isValid={(isDirty && !invalid) && !error}
                        isInvalid={(isDirty && invalid) || !!error}
                      />

                      {error
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
            </Form.Group>
          </Form>

          {errors && errors.formError && <FormAlert text={errors.formError.message} />}
        </Modal.Body>

        <Modal.Footer>
          <Button
            name={'submitURL'}
            variant="primary"
            type={'submit'}
            form={'submit-form'}
            onClick={() => clearErrors()}
          >
            Ok
          </Button>
          <Button
            variant="secondary"
            onClick={() => leaveThisDialog()}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UrlInputDialog;
