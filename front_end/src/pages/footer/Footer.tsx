import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Container } from "react-bootstrap";
import Copyright from "../../components/Copyright";
import { CurUserContext } from "../../common/CurUserContext";

import './Footer.scss';

type FooterLinkProps = {
  linkTo: string,
  text: string | undefined,
}

function FooterLink({ linkTo, text, }: FooterLinkProps) {
  return (
    <div className={'footer-link-list-item'}>
      <NavLink to={linkTo}>{text ?? ''}</NavLink>
    </div>
  );
}

/**
 * Footer structure:
 *
 * Link
 * Curve
 * Copyright
 *
 */
function Footer() {
  // @ts-ignore
  const { isSignIn } = useContext(CurUserContext);

  return (
    <Container as={'footer'} className={'footer-wrapper'}>
      <div className={'footer-link-list'}>
        <FooterLink text={'Home'} linkTo={'/'} />

        {/* Only display when not sign in */}
        {
          !isSignIn()
          &&
          <FooterLink text={'Sign in'} linkTo={'signin'} />
        }
      </div>

      <div className={'footer-curve'} />

      <div className={'copyright'}>
        <Copyright />
      </div>
    </Container>
  );
}

export default Footer;
