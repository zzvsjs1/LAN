import React from "react";
import { Button } from "react-bootstrap";

import './UserProfileDetail.scss';

type ProfileDetailProps = {
  curUser: UserObj,
  setShowProfileEdit: React.Dispatch<React.SetStateAction<boolean>>,
}

function UserProfileDetail({ curUser, setShowProfileEdit }: ProfileDetailProps) {
  // Show the user detail.
  return (
    <>
      <h5 className={'profile-detail-text'}>
        Username: <span>{curUser.username}</span>
      </h5>

      <h5 className={'profile-detail-text'}>
        Email: <span>{curUser.email}</span>
      </h5>

      <Button
        className={'edit-btn'}
        type={'button'}
        variant={'outline-primary'}
        onClick={() => setShowProfileEdit(true)}
      >
        Edit
      </Button>
    </>
  );
}

export default UserProfileDetail;
