import { Paper } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function NoThisPagePanel() {
  return (
    <Box sx={{ m: '5rem' }}>
      <Paper sx={{ p: '3rem' }}>
        <Typography variant={'h2'} align={'center'} sx={{ color: (theme) => theme.palette.secondary.main }} >
          Not a valid url.
        </Typography>
      </Paper>
    </Box>
  );
}