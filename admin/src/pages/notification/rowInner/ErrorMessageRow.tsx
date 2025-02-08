import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type ErrorMessageRowProps = {
  msg: string
}

export function ErrorMessageRow({ msg }: ErrorMessageRowProps) {
  return (
    <Box sx={{ my: '2rem', px: 1 }}>
      <Typography variant={'body1'} sx={{ overflowWrap: 'break-all', hyphens: 'manual' }}>
        {msg}
      </Typography>
    </Box>
  );
}