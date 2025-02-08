import { Image } from "react-bootstrap";

import defaultIcon from '../../../assets/images/common/avatar/default_account.svg';

import './PostAvatar.scss';

type PostAvatarProps = {
  src?: string | null
}

function PostAvatar({ src }: PostAvatarProps) {
  return (
    <div className={'post-reply-avatar'}>
      {/* Set user avatar */}
      <Image className={'post-reply-avatar-img'} src={src ?? defaultIcon} />
    </div>
  );
}

export default PostAvatar;