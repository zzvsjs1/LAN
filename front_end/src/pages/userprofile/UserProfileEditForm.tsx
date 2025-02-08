import { Controller, SubmitHandler, useForm } from "react-hook-form";
import React, { useState } from "react";
import EditSuccessDialog from "./EditSuccessDialog";
import { Button, Col, Form, Row } from "react-bootstrap";
import { isCorrectPassword, isEmail, isValidMsg } from "../../common/userProfileFromValidation";
import { isEmptyOrBlank } from "../../common/strings";
import FormAlert from "../../components/FormAlert";

import './UserProfileEditForm.scss';

type ProfileContentFormProps = {
  curUserContext: CurUserContextI,
  setShowProfileEdit: React.Dispatch<React.SetStateAction<boolean>>,
}

type ContentFormValues = {
  username: string,
  email: string,
  password: string,
  formError: any,
}

const EMAIL = 'email';
const USER_NAME = 'username';
const PASSWORD = 'password';
const FORM_ERROR = 'formError';

function UserProfileEditForm({ curUserContext, setShowProfileEdit }: ProfileContentFormProps) {
  const { curUser, updateCurUserByField } = curUserContext;

  const {
    handleSubmit,
    setError,
    clearErrors,
    control,
    formState: {
      isDirty,
      errors,
    }
  } = useForm<ContentFormValues>({
    mode: 'onTouched',
    defaultValues: {
      username: curUser!.username,
      email: curUser!.email,
      password: '',
    },
  });

  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);

  const onSubmit: SubmitHandler<ContentFormValues> = async (value: ContentFormValues, e: any) => {
    e?.preventDefault();

    // We need to update the user data in here.
    try {
      // If password empty. We don't want to change the password.
      if (value.password.length === 0) {
        // Not evil, but typescript not recommend me to delete a field.
        // I cannot say this approach is bad...
        // But, yes. Try to avoid this approach is good.

        // @ts-ignore
        delete value.password;
      }

      // Update temp user value.
      await updateCurUserByField(value);

      // Show success dialog.
      setShowSuccessDialog(true);
    } catch (e: unknown) {
      const errMsg: string = e instanceof Error ? e.message : 'Unknown error.';
      setError(FORM_ERROR, { type: 'Form error', message: errMsg });
    }
  }

  return (
    <>
      {
        showSuccessDialog
        &&
        <EditSuccessDialog
          title={isDirty ? 'Success.' : 'Unchanged.'}
          body={isDirty ? 'Edit successful.' : 'Profile unchanged.'}
          setShow={(val: boolean) => {
            setShowSuccessDialog(val);

            // If unchanged, we do not switch back to profile detail.
            if (!isDirty) {
              return;
            }

            setShowProfileEdit(val);
          }}
        />
      }

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group>
          <Form.Label className={'lan-label'} onClick={() => console.log(isDirty)}>
            Username:
          </Form.Label>

          <Controller
            name={USER_NAME}
            control={control}
            rules={{
              validate: (value: string) => isValidMsg(
                () => !isEmptyOrBlank(value),
                'Username cannot be empty or blank.'
              )
            }}
            render={({
                       field: { onChange, onBlur, value, name },
                       fieldState: {
                         invalid, isDirty, error
                       }
                     }) =>
              (
                <>
                  <Form.Control
                    type="text"
                    name={name}
                    placeholder="New username"
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    isValid={(isDirty && !invalid) && !error}
                    isInvalid={(isDirty && invalid) || !!error}
                  />

                  {error &&
                    <Form.Control.Feedback type="invalid">
                      {error.message}
                    </Form.Control.Feedback>
                  }
                </>
              )} />
        </Form.Group>

        <Form.Group>
          <Form.Label className={'lan-label'}>
            Email:
          </Form.Label>

          <Controller
            name={EMAIL}
            control={control}
            rules={{
              validate: (value: string) => isValidMsg(
                () => isEmail(value),
                'This value is not a valid email.'
              )
            }}
            render={({
                       field: { onChange, onBlur, value, name },
                       fieldState: { invalid, isDirty, error }
                     }) =>
              (
                <>
                  <Form.Control
                    type="text"
                    name={name}
                    placeholder="New email"
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    isValid={(isDirty && !invalid) && !error}
                    isInvalid={(isDirty && invalid) || !!error}
                  />

                  {error &&
                    <Form.Control.Feedback type="invalid">
                      {error.message}
                    </Form.Control.Feedback>
                  }
                </>
              )} />
        </Form.Group>

        <Form.Group>
          <Form.Label className={'lan-label'}>
            Password:
          </Form.Label>

          <Controller
            name={PASSWORD}
            control={control}
            rules={{
              validate: (value: string) => {
                // Allow user not change the password.
                if (value.length === 0) {
                  return true;
                }

                return isValidMsg(
                  () => isCorrectPassword(value),
                  'The is not a strong password.'
                )
              }
            }}
            render={({
                       field: { onChange, onBlur, value, name },
                       fieldState: { invalid, isDirty, error }
                     }) => (
              <>
                <Form.Control
                  type="password"
                  placeholder={'New password'}
                  name={name}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  isValid={(isDirty && !invalid) && !error}
                  isInvalid={(isDirty && invalid) || !!error}
                />

                {error &&
                  <Form.Control.Feedback type="invalid">
                    {error.message}
                  </Form.Control.Feedback>
                }
              </>
            )} />
        </Form.Group>

        {errors && errors.formError && <FormAlert text={errors.formError.message} />}

        <Row>
          <Col>
            <Button
              name={'applyBtn'}
              className={'apply-btn'}
              variant={'outline-primary'}
              type={'submit'}
              onClick={() => clearErrors()}
            >
              Apply
            </Button>
          </Col>
          <Col>

            <Button
              name={'cancelBtn'}
              className={'apply-btn'}
              variant={'outline-primary'}
              type={'button'}
              onClick={() => setShowProfileEdit(false)}
            >
              Cancel
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default UserProfileEditForm;
