import Modal from 'react-bootstrap/Modal';
import { Button } from "react-bootstrap";
import React from "react";

type ErrorMessageDialogProps = {
  title: string,
  body: string,
  btnText: string,
  setShow: React.Dispatch<React.SetStateAction<boolean>>,
  callBack?: Function,
};

function ErrorMessageDialog({ title, body, btnText, setShow, callBack }: ErrorMessageDialogProps) {
  const leaveDialog = () => {
    setShow(false);

    // If callback exist, call it.
    if (callBack) {
      callBack();
    }
  };

  return (
    <>
      <Modal
        centered={true}
        show={true}
        onHide={leaveDialog}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {title}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {body}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="danger" onClick={leaveDialog}>
            {btnText}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ErrorMessageDialog;
