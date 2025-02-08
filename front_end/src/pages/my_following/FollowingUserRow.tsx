import { Button, Col, Row } from "react-bootstrap";
import PostAvatar from "../posting/common/PostAvatar";
import React from "react";

type FollowingUserProps = {
  user: UserObj,
  unfollow: (needToUnfollow: UserObj) => Promise<void>,
  seePost: (user: UserObj) => void,
}

/**
 * The following user row.
 *
 * @param user
 * @param unfollow
 * @param seePost
 */
export default function FollowingUserRow({ user, unfollow, seePost }: FollowingUserProps) {
  return (
    <Row className={'bg-light border border-opacity-50 user-bar'}>
      <Col className={'max-content'} xl={1} lg={3} md={2}>
        <PostAvatar src={user.avatar} />
      </Col>

      <Col className={'text-break'} xl={2} lg={3} md={2}>
        {user.username}
      </Col>

      <Col className={'text-break'} xl={3} lg={3} md={2}>
        {user.email}
      </Col>

      <Col className={'max-content'} xl={2} lg={3} md={2} sm={2}>
        <Button variant={'danger'} onClick={() => unfollow(user)}>
          Unfollow
        </Button>
      </Col>

      <Col className={'max-content'} xl={2} lg={3} md={2}>
        <Button variant={'outline-primary'} onClick={() => seePost(user)}>
          See posts
        </Button>
      </Col>
    </Row>
  );
}