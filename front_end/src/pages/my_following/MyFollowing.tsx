import { Container } from "react-bootstrap";
import PostsList from "./PostsList";
import React, { useState } from "react";
import { UserList } from "./UserList";

import './MyFollowing.scss';

export default function MyFollowing() {
  const [showPostList, setShowPostList] = useState<boolean>(false);
  const [needToShowUser, setNeedToShowUser] = useState<UserObj>({} as UserObj);

  // Switch two panels by use input.
  return (
    <>
      <Container className={'myfollowing-container'}>
        {
          showPostList
            ? <PostsList user={needToShowUser} setShowPostList={setShowPostList} />
            : <UserList setNeedToShowUser={setNeedToShowUser} setShowPostList={setShowPostList}/>
        }
      </Container>
    </>
  );
}