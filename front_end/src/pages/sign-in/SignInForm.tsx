import React from 'react';
import { Button, Form } from "react-bootstrap";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { isCorrectPassword, isValidMsg } from "../../common/userProfileFromValidation";
import FormAlert from "../../components/FormAlert";
import { isEmptyOrBlank } from "../../common/strings";

import './SignInFrom.scss';

const USERNAME = 'username';
const PASSWORD = 'password';
const FORM_ERROR = 'formError';

export type ReactSetStateFunction<T> = React.Dispatch<React.SetStateAction<T>>;

export type SignInFormProps = {
  curUserContext: CurUserContextI,
  setShowSuccessDialog: ReactSetStateFunction<boolean>,
};

export type SignInFormValues = {
  username: string,
  password: string,
  formError: any,
};

function SignInForm({ curUserContext, setShowSuccessDialog }: SignInFormProps) {
  const {
    handleSubmit,
    setError,
    clearErrors,
    control,
    formState: {
      errors,
    }
  } = useForm<SignInFormValues>({
    mode: 'onTouched',
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<SignInFormValues> = async (value: SignInFormValues, e: any) => {
    e?.preventDefault();

    try {
      // Do sign in.
      await curUserContext.signIn(value.username, value.password);
      setShowSuccessDialog(true);
    } catch (e: unknown) {
      let errMessage = e instanceof Error ? e.message : 'Unknown error.';
      setError(FORM_ERROR, { type: 'Sign in Error', message: errMessage, });
    }
  }

  return (
    <>
      <Form name={'signinform'} id={'signinform'} onSubmit={handleSubmit(onSubmit)}>
        <Form.Group>
          <Form.Label className={'lan-form-label'} id={'form-username'}>
            Username
          </Form.Label>
          <Controller
            name={USERNAME}
            control={control}
            rules={{
              validate: (value: string) => isValidMsg(
                () => !isEmptyOrBlank(value),
                'Username cannot be empty or blank.'
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
                    name={name}
                    placeholder="Your username"
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
                'Not a valid password.'
              )
            }}
            render={({
                       field: { onChange, onBlur, value, ref, name },
                       fieldState: { invalid, isDirty, error }
                     }) =>
              (
                <>
                  <Form.Control
                    type="password"
                    name={name}
                    placeholder="Your password"
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

        {errors && errors.formError && <FormAlert text={errors.formError.message} />}

        <div className={'btn-wrapper'}>
          <Button
            className={'submit-btn'}
            variant="outline-primary"
            type="submit"
            name={'submit'}
            value={'submit'}
            form={'signinform'}
            onClick={() => clearErrors()}
          >
            Submit
          </Button>
        </div>
      </Form>
    </>
  );
}

export default SignInForm;
