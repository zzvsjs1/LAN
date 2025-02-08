import { Modal } from "react-bootstrap";
import Image from "react-bootstrap/Image";

import './PostImageView.scss';

type PostImageViewProps = {
  showImageView: boolean,
  setShowImageView: (arg: boolean) => void,
  src: string,
};

function PostImageView({ showImageView, setShowImageView, src }: PostImageViewProps) {
  return (
    <Modal
      size={'xl'}
      show={showImageView}
      onHide={() => setShowImageView(false)}
      centered={true}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Image
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={'imageview-image-container'}>
          <Image className={'imageview-image'} src={src} />
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default PostImageView;
