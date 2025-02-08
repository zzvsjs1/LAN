import Typography from "@mui/material/Typography";

export default function Footer() {
  return (
    <Typography
      variant={'body2'}
      color={'text.secondary'}
      sx={{ m: '1rem auto' }}
      align={'center'}
    >
      Loop Agile © {new Date().getFullYear()}
    </Typography>
  )
}
