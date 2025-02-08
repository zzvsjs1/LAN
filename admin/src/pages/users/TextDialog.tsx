import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

type TextDialogProps = {
  title: string,
  text: string,
  setShow: React.Dispatch<React.SetStateAction<boolean>>,
}

/**
 * Add spacing to content and bottom bar.
 */
const LanTextDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  }
}));

export default function TextDialog({ title, text, setShow }: TextDialogProps) {
  return (
    // Always open.
    <LanTextDialog onClose={() => setShow(false)} open={true}>
      <DialogTitle sx={{ m: 0, p: 2, minWidth: 350 }}>
        {title}
        <IconButton
          onClick={() => setShow(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Typography sx={{ wordWrap: "break-word" }} gutterBottom>
          {text}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button autoFocus onClick={() => setShow(false)}>
          Close
        </Button>
      </DialogActions>
    </LanTextDialog>
  )
}