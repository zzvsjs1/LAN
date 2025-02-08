import { Container } from "react-bootstrap";

import './NoThisLinkPage.scss';

// Display error message, when url is not valid.
function NoThisLinkPage() {
  return (
    <Container className={'no-this-page-wrapper'}>
      <h1>
        This URL is invalid. Please go back to the valid page.
      </h1>
    </Container>
  );
}

export default NoThisLinkPage;
