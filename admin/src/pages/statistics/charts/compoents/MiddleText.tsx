import Typography from "@mui/material/Typography";
import React from "react";

type MidTextProps = {
  text: string
}

export default function MiddleText({ text }: MidTextProps) {
  return (
    // Put text in the middle of container.
    <Typography
      sx={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      component={'h3'}
      variant={'h6'}
      color={'secondary'}
    >
      {text}
    </Typography>
  );
}
