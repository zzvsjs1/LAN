import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';
import * as React from "react";

type UserAvatarProps = {
  src?: string | null
}

export default function UserAvatar({ src }: UserAvatarProps) {
  return (
    <>
      {
        src
          ?
          <Avatar src={src} />
          :
          <Avatar>
            <PersonIcon fontSize={'large'} />
          </Avatar>
      }
    </>
  );
}