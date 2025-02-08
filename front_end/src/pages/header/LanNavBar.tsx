import { useContext } from "react";
import { Nav } from 'react-bootstrap';
import { NavLink } from "react-router-dom";
import { CurUserContext } from "../../common/CurUserContext";

import '../../scss/lan-custom-bootstrap.scss'
import './nav-link.scss';

function LanNavBar() {
  const { isSignIn } = useContext(CurUserContext);

  return (
    <Nav>
      <Nav.Item>
        <NavLink
          to={'/'}
          className={'lan-nav-link'}
          title={'Home'}
        >
          Home
        </NavLink>
      </Nav.Item>

      <Nav.Item>
        {/* If not sign in, do no display posting page. */}
        {
          isSignIn()
          &&
          <NavLink to={'posting'} className={'lan-nav-link'} title={'Posting'}>
            Posting
          </NavLink>
        }
      </Nav.Item>

      <Nav.Item>
      {
        isSignIn()
        &&
        <NavLink to={'myfollowing'} className={'lan-nav-link'} title={'My_following'}>
          My following
        </NavLink>
      }
      </Nav.Item>
    </Nav>
  );
}

export default LanNavBar;
