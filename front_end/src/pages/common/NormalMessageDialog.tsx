import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { Button } from "react-bootstrap";

type NormalMessageDialogProps = {
  callBack: () => void,
  title?: string,
  body?: string,
  btnText?: string,
}

function NormalMessageDialog({ callBack, title, body, btnText, }: NormalMessageDialogProps) {
  const [show, setShow] = useState<boolean>(true);

  const handleClose = () => {
    setShow(false);

    if (callBack) {
      callBack();
    }
  }

  return (
    <>
      <Modal
        centered={true}
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {title ?? 'None'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {body ?? 'None'}
        </Modal.Body>

        <Modal.Footer>
          <Button variant='outline-primary' onClick={handleClose}>
            {btnText ?? 'Ok'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default NormalMessageDialog;
