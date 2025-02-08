import { Image } from "react-bootstrap";
import PostImageView from "../common/PostImageView";
import { useState } from "react";

import './PostImage.scss';

type PostImageProps = {
  src: string,
}

function PostImage({ src }: PostImageProps) {
  const [showImageView, setShowImageView] = useState<boolean>(false);

  return (
    <>
      {
        showImageView
        &&
        <PostImageView
          showImageView={showImageView}
          setShowImageView={setShowImageView}
          src={src}
        />
      }

      {/* Open the image view. */}
      <div className={'post-image'} onClick={() => setShowImageView(true)}>
        <Image data-testid={`postImg-${src}`} className={'post-actual-image'} src={src} />
      </div>
    </>
  );
}

export default PostImage;
