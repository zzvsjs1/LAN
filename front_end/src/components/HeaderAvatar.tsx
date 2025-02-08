import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { CurUserContext } from "../common/CurUserContext";
import defaultIcon from "../assets/images/common/avatar/default_account.svg";
import Image from "react-bootstrap/Image";

import './HeaderAvatar.scss';

function HeaderAvatar() {
  // @ts-ignore
  const { curUser, isSignIn } = useContext(CurUserContext);

  return (
    <NavLink to={isSignIn() ? 'userprofile' : 'signin'}>
      <div className={'user-avatar'} title={'User profile'}>
        {
          isSignIn()
            ? <Image src={curUser!.avatar ?? defaultIcon} fluid={true} />
            : <Image src={defaultIcon} fluid={true} />
        }
      </div>
    </NavLink>
  );
}

export default HeaderAvatar;
