import { useContext, useState } from "react";
import { Container } from "react-bootstrap";
import { CurUserContext } from "../../common/CurUserContext";
import NavDialog from "../../components/NavDialog";
import SignInForm from "./SignInForm";

import './SignInPage.scss';

function SignInPage() {
  const curUserContext = useContext<CurUserContextI>(CurUserContext);

  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);

  return (
    <>
      {
        showSuccessDialog
        &&
        <NavDialog path={'/userprofile'} title={'Success'} body={'Sign in successful.'} />
      }

      <Container className={'signin-form-container'}>

        {/* Form title */}
        <h1 className={'text-center mb-3'}>
          Sign in
        </h1>

        <SignInForm curUserContext={curUserContext} setShowSuccessDialog={setShowSuccessDialog} />
      </Container>
    </>
  );
}

export default SignInPage;
