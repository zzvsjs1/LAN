import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import { AxiosError } from "axios";
import { toErrorPage, toErrorPageException } from "../../backend/toErrorPage";

type DeleteUserProfileDialogProps = {
  setShowDelDialog: React.Dispatch<React.SetStateAction<boolean>>,
  curUserContext: CurUserContextI,
}

/**
 * Show this dialog when user want to delete their profile.
 */
function DeleteUserProfileDialog({ setShowDelDialog, curUserContext }: DeleteUserProfileDialogProps) {
  const navigate = useNavigate();
  const { deleteCurUserAccount } = curUserContext;

  const [showAfterDel, setShowAfterDel] = useState<boolean>(false);

  const handleClose = () => {
    setShowDelDialog(false);
  }

  const handleDelete = () => {
    // Hide ourself.
    setShowAfterDel(true);
  }

  const handleBackToHome = async () => {
    // Back to home. No keep the history.
    // Delete current user. And navigate to home page.
    // An Evil solutions.
    try {
      await deleteCurUserAccount();
      navigate('/', { replace: true });
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        if (e.response) {
          toErrorPage(navigate, e.response.data.message);
        }
      }

      toErrorPageException(navigate, e);
    }
  }

  return (
    <>
      <Modal
        centered={true}
        show={true}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title as={'h3'}>
            {showAfterDel ? 'Delete successful' : 'Are you sure?'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body as={'p'}>
          {
            showAfterDel
              ? 'Press button back to home page.'
              : 'Are you sure to delete this account?\nYou will lost all the posts and replies.'
          }
        </Modal.Body>

        <Modal.Footer>
          {
            showAfterDel
              ?
              <Button variant="secondary" onClick={handleBackToHome}>
                Back to home
              </Button>
              :
              <>
                <Button variant="danger" onClick={handleDelete}>
                  Yes
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                  No
                </Button>
              </>
          }
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteUserProfileDialog;
