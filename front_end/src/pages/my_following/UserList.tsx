import React, { useCallback, useContext, useEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import { CurUserContext } from "../../common/CurUserContext";
import {
  addFollowing,
  FollowingAndNoFollowingObjT,
  getFollowingAndNoFollowing,
  unFollowingUser
} from "../../backend/followerUtils";
import { useNavigate } from "react-router-dom";
import { toErrorPageException } from "../../backend/toErrorPage";
import FollowingUserRow from "./FollowingUserRow";
import NoFollowingUserRow from "./NoFollowingUserRow";

import './UserList.scss';

type UserListProps = {
  setNeedToShowUser: (user: UserObj) => void,
  setShowPostList: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * A list to show all the users.
 *
 * @param setNeedToShowUser
 * @param setShowPostList
 */
export function UserList({ setNeedToShowUser, setShowPostList }: UserListProps) {
  const [followAndNotFollow, setFollowAndNotFollow] = useState<FollowingAndNoFollowingObjT>({
    following: [],
    noFollowing: [],
  });

  const { curUser } = useContext<CurUserContextI>(CurUserContext);
  const navigate = useNavigate();

  /**
   * Fetch the following data, and set the dat to state.
   *
   * useCallBack can avoid we create this function again and again.
   */
  const fetchFollowing = useCallback(async () => {
      try {
        const ret = await getFollowingAndNoFollowing(curUser!.username)
        setFollowAndNotFollow(ret);
      } catch (e: unknown) {
        toErrorPageException(navigate, e)
      }
    }, [curUser, navigate]
  );

  /**
   * Prefetch data. Only run once.
   */
  useEffect(() => {
      fetchFollowing().catch(console.log);
    }, [fetchFollowing]
  );

  /**
   * Switch the page to post list.
   * @param user
   */
  const seePost = (user: UserObj) => {
    setNeedToShowUser(user);
    setShowPostList(true);
  };

  /**
   * Unfollowing a user by input.
   *
   * @param needToUnfollow
   */
  const unfollow = async (needToUnfollow: UserObj) => {
    try {
      await unFollowingUser(curUser!.username, needToUnfollow.username);
      await fetchFollowing();
    } catch (e: unknown) {
      toErrorPageException(navigate, e);
    }
  };

  /**
   * Following a user by input user object.
   * @param needToFollow
   */
  const followUser = async (needToFollow: UserObj) => {
    try {
      await addFollowing(curUser!.username, needToFollow.username);
      await fetchFollowing();
    } catch (e: unknown) {
      toErrorPageException(navigate, e);
    }
  };

  return (
    <>
      <h3 className={'text-center'}>
        People you follow
      </h3>

      {
        followAndNotFollow.following.length === 0
          ?
          <h5 className={'text-center mt-8 userlist-h5'}>
            Nothing to show in here. Try to follow some users.
          </h5>
          :
          <Stack className={'mt-4'} gap={3}>
            {
              followAndNotFollow
                .following
                .map(user =>
                  <FollowingUserRow key={user.username} user={user} unfollow={unfollow} seePost={seePost} />
                )
            }
          </Stack>
      }

      {/* Show other user in here. */}
      <h3 className={'text-center mt-3'}>
        Other user
      </h3>

      {
        followAndNotFollow.noFollowing.length === 0
          ?
          <h5 className={'text-center mt-8'}>
            No other users can be followed.
          </h5>
          :
          <Stack className={'mt-4'} gap={3}>
            {
              followAndNotFollow
                .noFollowing
                .map(user =>
                  <NoFollowingUserRow key={user.username} user={user} followUser={followUser} />
                )
            }
          </Stack>
      }
    </>
  );
}