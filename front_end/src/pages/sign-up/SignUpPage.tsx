import { useState, useContext } from 'react';
import { Button, Container, Form } from "react-bootstrap";
import { isCorrectPassword } from "../../common/userProfileFromValidation";
import { addNewUserToBackEnd } from "../../backend/userUtils";
import { CurUserContext } from "../../common/CurUserContext";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { isValidMsg, isEmail } from '../../common/userProfileFromValidation';
import { isEmptyOrBlank } from "../../common/strings";
import FormAlert from "../../components/FormAlert";
import NavDialog from "../../components/NavDialog";

import './SignUpPage.scss';

const EMAIL = 'email';
const USER_NAME = 'username';
const PASSWORD = 'password';
const FORM_ERROR = 'formError';

type SignUpFormValues = {
  username: string,
  email: string,
  password: string,
  formError: any,
};

function SignUpPage() {
  const {
    handleSubmit,
    setError,
    clearErrors,
    control,
    formState: {
      errors,
    }
  } = useForm<SignUpFormValues>({
    mode: 'onTouched',
    defaultValues: {
      email: '',
      username: '',
      password: '',
    },
  });

  const { signIn } = useContext<CurUserContextI>(CurUserContext);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);

  const onSubmit: SubmitHandler<SignUpFormValues> = async (value: SignUpFormValues, e: any) => {
    e?.preventDefault();

    // No error, do submission.
    // We add the user to database.
    try {
      await addNewUserToBackEnd(value.username, value.email, value.password);

      // All done.
      // Do sign in
      await signIn(value.username, value.password);

      // Avoid create another entry in the history stack for the login page.
      // Otherwise, they can go back.
      setShowSuccessDialog(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error.';
      setError(FORM_ERROR, { type: 'Signup or signin Error', message: msg, });
    }
  };

  return (
    <>
      {
        showSuccessDialog
        &&
        <NavDialog
          path={'/userprofile'}
          title={'Success'}
          body={'Create account successful. You are now signed in.'}
        />
      }

      <Container className={'signup-form-container'}>

        <Form name={'signupform'} onSubmit={handleSubmit(onSubmit)}>
          {/* Form title */}
          <h1 className={'text-center mb-3'}>
            Sign up
          </h1>

          <Form.Group>
            <Form.Label className={'lan-form-label'} id={'form-username'}>
              Username
            </Form.Label>

            <Controller
              name={USER_NAME}
              control={control}
              rules={{
                validate: (value: string) => isValidMsg(
                  () => !isEmptyOrBlank(value)
                  , 'Username cannot be empty or blank.'
                )
              }}
              render={({
                         field: { onChange, onBlur, value, ref, name },
                         fieldState: { invalid, isDirty, error }
                       }) => (
                <>
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    name={name}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    ref={ref}
                    isValid={(isDirty && !invalid) && !error}
                    isInvalid={(isDirty && invalid) || !!error}
                  />

                  {/* If error occur */}
                  {error && <FormAlert text={error.message} />}
                </>
              )} />
          </Form.Group>

          <Form.Group>
            <Form.Label className={'lan-form-label'} id={'form-email'}>
              Email
            </Form.Label>

            <Controller
              name={EMAIL}
              control={control}
              rules={{
                validate: (value: string) => isValidMsg(
                  () => isEmail(value),
                  'This is not a valid email.'
                )
              }}
              render={({
                         field: { onChange, onBlur, value, ref, name },
                         fieldState: { invalid, isDirty, error }
                       }) =>
                (
                  <>
                    <Form.Control
                      type="text"
                      placeholder="name@example.com"
                      name={name}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      ref={ref}
                      isValid={(isDirty && !invalid) && !error}
                      isInvalid={(isDirty && invalid) || !!error}
                    />

                    {error && <FormAlert text={error.message} />}
                  </>
                )}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className={'lan-form-label'} id={'form-password'}>
              Password
            </Form.Label>

            <Controller
              name={PASSWORD}
              control={control}
              rules={{
                validate: (value: string) => isValidMsg(
                  () => isCorrectPassword(value),
                  'This is not a strong password.'
                )
              }}
              render={({
                         field: { onChange, onBlur, value, ref, name },
                         fieldState: { invalid, isDirty, error }
                       }) => (
                <>
                  <Form.Control
                    type="password"
                    placeholder={
                      'At least 8 characters. ' +
                      'Include at least 1 uppercase, ' +
                      '1 special character and 1 number.'
                    }
                    name={name}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    ref={ref}
                    isValid={(isDirty && !invalid) && !error}
                    isInvalid={(isDirty && invalid) || !!error}
                  />

                  {error && <FormAlert text={error.message} />}
                </>
              )} />
          </Form.Group>

          {/* Show form error in here. */}
          {errors && errors.formError && <FormAlert text={errors.formError.message} />}

          <div className={'btn-wrapper'}>
            <Button
              className={'submit-btn'}
              variant="outline-primary"
              type="submit"
              name={'submit'}
              value={'submit'}
              onClick={() => clearErrors()}
            >
              Submit
            </Button>
          </div>
        </Form>
      </Container>
    </>
  )
}

export default SignUpPage;
