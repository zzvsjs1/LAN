import React from "react";
import Modal from 'react-bootstrap/Modal';
import { Button } from "react-bootstrap";

type DeleteDialogProps = {
  title: string | undefined | null,
  body: string | undefined | null,
  showReplyDelDialog: boolean,
  setShowReplyDelDialog: React.Dispatch<React.SetStateAction<boolean>>,
  callBack: Function,
};

/**
 * Call the call back function when this dialog close.
 *
 * @param title
 * @param body
 * @param showReplyDelDialog
 * @param setShowReplyDelDialog
 * @param callBack
 */
function DeleteDialog({
                        title,
                        body,
                        showReplyDelDialog,
                        setShowReplyDelDialog,
                        callBack,
                      }: DeleteDialogProps
) {
  return (
    <Modal
      show={showReplyDelDialog}
      onHide={() => setShowReplyDelDialog(false)}
      centered={true}
      backdrop={'static'}
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title>
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {body}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={() => callBack()}>
          Ok
        </Button>
        <Button variant="secondary" onClick={() => setShowReplyDelDialog(false)}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteDialog;
