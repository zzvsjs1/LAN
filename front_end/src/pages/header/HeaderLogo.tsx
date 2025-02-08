import { Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";

import './HeaderLogo.scss';

function HeaderLogo() {
  // Actually, the logo is a Link.
  return (
    <>
      <Navbar.Brand as={'div'} className={'logo-area'} title={'Back to home page'}>
        <NavLink
          className={'logo'}
          to={'/'}
          title={'Home'}>
          <div className={'logo-icon'}>
            LAN
          </div>
          <h2 className={'logo-text'}>
            Loop Agile Now
          </h2>
        </NavLink>
      </Navbar.Brand>
    </>
  );
}

export default HeaderLogo;
