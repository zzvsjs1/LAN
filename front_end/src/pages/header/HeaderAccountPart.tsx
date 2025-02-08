import { useContext } from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { CurUserContext } from "../../common/CurUserContext";

import HeaderAvatar from "../../components/HeaderAvatar";

import './HeaderAccountPart.scss';
import './nav-link.scss';

function HeaderAccountPart() {
  const { isSignIn, signOut } = useContext(CurUserContext);

  // Nothing special. Just show different link depend on the sign in state.
  return (
    <Nav className={'flex-row align-items-center'}>
      <Nav.Item>
        {
          !isSignIn()
          &&
          <NavLink to={'/signup'} className={'lan-nav-link'}>
            Sign up
          </NavLink>
        }
      </Nav.Item>

      <Nav.Item>
        {
          isSignIn()
            ?
            <NavLink to={'/'} className={'lan-nav-link'} onClick={() => signOut()}>
              Sign out
            </NavLink>
            :
            <NavLink to={'/signin'} className={'lan-nav-link'}>
              Sign in
            </NavLink>
        }
      </Nav.Item>

      <Nav.Item>
        <HeaderAvatar />
      </Nav.Item>
    </Nav>
  );
}

export default HeaderAccountPart;
