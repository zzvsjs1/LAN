import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

/**
 * Negative to this page, if error occur.
 */
export default function ErrorPage() {
  const { state } = useLocation();

  return (
    <Box>
      <Typography
        sx={{
          color: 'red',
          m: '40vh auto auto auto',
          maxWidth: '50vw',
          wordWrap: 'break-word'
        }}
        align={'center'}
        variant={'h4'}
      >
        {state && state.info ? state.info : 'Unknown error'}
      </Typography>
    </Box>
  );
}