import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";

type EditSuccessDialogProps = {
  title: string | undefined | null,
  body: string | undefined | null,
  setShow: (arg: boolean) => void,
}

function EditSuccessDialog({ title, body, setShow }: EditSuccessDialogProps) {
  const handleClose = () => setShow(false);

  return (
    <>
      <Modal
        centered={true}
        show={true}
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

export default EditSuccessDialog;
