import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";

type PostSuccessDialogProps = {
  title: string,
  body: string,
  show: boolean,
  setShow: (arg: boolean) => void,
}

function PostSuccessDialog({ title, body, show, setShow }: PostSuccessDialogProps) {
  const handleClose = () => {
    setShow(false);
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
            {title}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body as={'p'}>
          {body}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-primary" onClick={handleClose}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PostSuccessDialog;
