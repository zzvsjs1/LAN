import Modal from 'react-bootstrap/Modal';
import { Button } from "react-bootstrap";
import React from "react";

type CommonMessageDialogProps = {
  title: string,
  body: string,
  btnText: string,
  setShow: React.Dispatch<React.SetStateAction<boolean>>,
  callBack: Function,
};

/**
 * Show message dialog. Run call back when close.
 */
function CommonMessageDialog({ title, body, btnText, setShow, callBack }: CommonMessageDialogProps) {
  return (
    <>
      <Modal
        centered={true}
        show={true}
        onHide={() => {
          setShow(false);
          callBack();
        }}
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
          <Button variant="outline-primary" onClick={() => {
            setShow(false);
            callBack();
          }}>
            {btnText}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CommonMessageDialog;
