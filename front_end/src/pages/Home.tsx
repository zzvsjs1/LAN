import { Button } from "react-bootstrap";
import Image from 'react-bootstrap/Image';
import { Link } from 'react-router-dom';
import { useContext } from "react";
import { CurUserContext } from "../common/CurUserContext";

import home_page_intro_image_1_office from '../assets/images/home/home_page_intro_image_1_office.webp';
import home_intro_second from '../assets/images/home/home_intro_second.webp';
import home_intro_third from '../assets/images/home/home_intro_third.webp';
import home_intro_forth from '../assets/images/home/home_intro_fourth.webp';

import '../scss/lan-custom-bootstrap.scss';
import './Home.scss';

function Home() {
  const { isSignIn } = useContext<CurUserContextI>(CurUserContext);

  // Very simple html.
  // No complex logic in this part.
  return (
    <>
      {/* The hero image and text. */}
      <figure className={'hero-part'}>
        <Image className={'hero-image'} src={home_page_intro_image_1_office} alt={'The office.'} />

        <figcaption className={'hero-text'}>
          <h1 className={'hero-title'}>
            Loop Agile Now
          </h1>
          <div className={'hero-content'}>
            Safe, fast and efficient social media
          </div>

          {/* Note: This button will change when user signin or not. */}
          <Link to={isSignIn() ? 'posting' : 'signin'} className={'start-using-btn-link'}>
            <Button className={'hero-btn'} variant={'primary'} title={'start using'}>
              Start Using
            </Button>
          </Link>
        </figcaption>
      </figure>

      {/* The second intro info. */}
      <div className={'home-half-img-text-wrapper'}>
        {/* Half image, half text. */}
        <div className={'home-half-img-text'}>
          <h1>
            Good communication way for you
          </h1>
          <p className={'intro-text'}>
            Secure and compliant with current privacy requirements. Don't worry about firm's policies.
          </p>
        </div>
        <Image
          className={'home-half-image'}
          src={home_intro_second}
          alt={'The second intro.'}
          fluid={true}
        />
      </div>

      <div className={'home-half-img-text-wrapper'}>
        {/* Half image, half text. */}
        <Image
          className={'home-half-image'}
          src={home_intro_third}
          alt={'The second intro.'}
          fluid={true}
        />
        <div className={'home-half-img-text'}>
          <h1>
            Simple and ad-free
          </h1>
          <p className={'intro-text'}>
            No pointless features and no ads to worry about.
          </p>
        </div>
      </div>

      <div className={'home-half-img-text-wrapper'}>
        <div className={'home-half-img-text'}>
          <h1>
            Start using now
          </h1>
          <p className={'intro-text'}>
            Click the button below to register an account.
            If you are already logged in to your account, you will need to log out first.
          </p>

          <Link to={isSignIn() ? 'userprofile' : 'signin'}>
            <Button className={'signup-btn'} variant={'outline-primary'} title={'Sign Up'}>
              Sign Up
            </Button>
          </Link>
        </div>

        <Image
          className={'home-half-image'}
          src={home_intro_forth}
          alt={'The second intro.'}
          fluid={true}
        />
      </div>
    </>
  );
}

export default Home;
