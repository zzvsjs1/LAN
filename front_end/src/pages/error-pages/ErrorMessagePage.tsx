import { Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";

import './ErrorMessagePage.scss';

/**
 * Display the error message pass by react router.
 */
export default function ErrorMessagePage() {
  const { state } = useLocation();

  return (
    <Container className={'error-page-container'}>
      <h4 className={'error-text'}>
        {state && state.info ? state.info : 'Unknown error'}
      </h4>
    </Container>
  )
}
