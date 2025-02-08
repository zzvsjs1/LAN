import { Button, Col, Row } from "react-bootstrap";
import PostAvatar from "../posting/common/PostAvatar";
import React from "react";

type NoFollowingUserProps = {
  user: UserObj
  followUser: (needToFollow: UserObj) => Promise<void>,
}

/**
 * The no following user row.
 *
 * @param user
 * @param followUser
 * @constructor
 */
export default function NoFollowingUserRow({ user, followUser }: NoFollowingUserProps) {
  return (
    <Row className={'bg-light border border-opacity-50 user-bar'}>
      <Col xl={1} lg={3} md={2}>
        <PostAvatar src={user.avatar} />
      </Col>

      <Col className={'text-break'} xl={2} lg={3} md={2}>
        {user.username}
      </Col>

      <Col className={'text-break'} xl={3} lg={3} md={2}>
        {user.email}
      </Col>

      <Col className={'max-content'} xl={2} lg={3} md={2} sm={2}>
        <Button variant={'primary'} onClick={() => followUser(user)}>
          Follow
        </Button>
      </Col>
    </Row>
  );
}