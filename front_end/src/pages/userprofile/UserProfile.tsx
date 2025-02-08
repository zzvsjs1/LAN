import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { CurUserContext } from "../../common/CurUserContext";
import Image from "react-bootstrap/Image";

import UserProfileEditForm from "./UserProfileEditForm";
import DeleteUserProfileDialog from "./DeleteUserProfileDialog";
import UserProfileDetail from "./UserProfileDetail";
import UrlInputDialog from "../posting/common/UrlInputDialog";
import ErrorMessageDialog from "../common/ErrorMessageDialog";
import { useNavigate } from "react-router-dom";
import { addProfileVisit } from "../../backend/userProfileVisit";
import { toErrorPageException } from "../../backend/toErrorPage";

import defaultIcon from '../../assets/images/common/avatar/default_account.svg';

import './UserProfile.scss';

type ErrorDataT = {
  body: string,
  btnText: string,
  setShow: React.Dispatch<React.SetStateAction<boolean>>,
}

const LOCAL = 'en-au';

function UserProfile() {
  const [showDelDialog, setShowDelDialog] = useState<boolean>(false);
  const [showProfileEdit, setShowProfileEdit] = useState<boolean>(false);
  const [showUrlInputDialog, setShowUrlInputDialog] = useState<boolean>(false);
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);
  const [errorData, setErrorData] = useState<ErrorDataT>({} as ErrorDataT);

  const curUserContext = useContext<CurUserContextI>(CurUserContext);

  const { curUser } = curUserContext;

  const navigate = useNavigate();

  useEffect(() => {
    // Send a profile visited record to backend.
    addProfileVisit(curUser!).catch(reason => toErrorPageException(navigate, reason));
  }, [navigate, curUser]);

  const changeAvatar = async (imageUrl: string) => {
    try {
      await curUserContext.updateCurUserByField({
        // If empty, change to null.
        // Which means the user have removes their avatar.
        avatar: imageUrl.length === 0 ? null : imageUrl,
      });
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : 'Unknown error.';
      setErrorData({ body: errMsg, btnText: 'Ok', setShow: setShowErrorDialog });
    }
  };

  return (
    <>
      {
        showErrorDialog
        &&
        <ErrorMessageDialog
          title={'Error'}
          body={errorData.body}
          btnText={errorData.btnText}
          setShow={errorData.setShow}
        />
      }

      {
        showDelDialog
        &&
        <DeleteUserProfileDialog setShowDelDialog={setShowDelDialog} curUserContext={curUserContext} />
      }

      <UrlInputDialog
        showUrlInputDialog={showUrlInputDialog}
        setShowUrlInputDialog={setShowUrlInputDialog}
        addImageToImages={changeAvatar}
        allowEmpty={true}
      />

      <Container className={'userprofile-container'}>
        <h2 className={'profile-title'}>
          Hello {curUser!.username}
        </h2>

        {/* Left part is avatar, right part is editor. */}
        <Row className={'profile-inner-container'}>
          <Col className={'avatar-wrapper'}>
            <div className={'profile-avatar'}>
              <Image src={curUser!.avatar ?? defaultIcon} fluid={true} alt={'avataricon'} />
            </div>
            <div>
              <div className={'join-date-text'}>
                Join date: {new Date(curUser!.joinDate).toLocaleDateString(LOCAL)}
              </div>
            </div>
            <Button
              name={'changeAvatarBtn'}
              className={'profile-avatar-btn'}
              variant={'outline-primary'}
              onClick={() => setShowUrlInputDialog(true)}
            >
              Change Avatar
            </Button>
          </Col>

          <Col className={'detail-wrapper'}>
            {/* Show profile or editor. */}
            {
              showProfileEdit
                ? <UserProfileEditForm curUserContext={curUserContext!} setShowProfileEdit={setShowProfileEdit} />
                : <UserProfileDetail curUser={curUser!} setShowProfileEdit={setShowProfileEdit} />
            }
          </Col>
        </Row>

        <Button
          name={'delBtn'}
          variant={'danger'}
          className={'delete-btn'}
          onClick={() => setShowDelDialog(true)}
        >
          Delete Account
        </Button>
      </Container>
    </>
  );
}

export default UserProfile;
