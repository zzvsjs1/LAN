import { Container } from "react-bootstrap";
import { Navbar } from "react-bootstrap";

import LanNavBar from "./LanNavBar";
import HeaderLogo from "./HeaderLogo";
import HeaderAccountPart from "./HeaderAccountPart";

import './Header.scss';

/**
 * The header have below part:
 *
 * header
 *  bootstrap-nav
 *    logo
 *    other pages
 *    sign-in sign-up avatar
 *
 * The main color is green.
 *
 *
 */
function Header() {
  return (
    <Container as={'header'} className={'header-wrapper'}>
      {/* If less than lg. Use collapse. */}
      <Navbar className={'header-inner'} collapseOnSelect expand={'lg'}>

        {/* The text base logo. */}
        <HeaderLogo/>

        <Navbar.Toggle aria-controls={'responsive-navbar-nav'}/>
        <Navbar.Collapse id="lan-responsive-navbar-nav">

          {/* The actual navigation bar. */}
          <LanNavBar />

          {/* User icon and other options */}
          <div className={'align-flex-right'}>
            <HeaderAccountPart />
          </div>

        </Navbar.Collapse>
      </Navbar>
    </Container>
  );
}

export default Header;
