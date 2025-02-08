import * as React from 'react';
import Typography from '@mui/material/Typography';

interface TitleProps {
  children?: React.ReactNode;
}

export default function ChartTitle({ children }: TitleProps) {
  return (
    <Typography  sx={{ mb: '2rem' }} component={'h2'} variant={'h6'} color={'primary'} gutterBottom>
      {children}
    </Typography>
  );
}