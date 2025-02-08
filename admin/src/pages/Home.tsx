import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";

const OPTS: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  timeZoneName: 'short'
};

function getFormatDate(date: Date): string {
  return date.toLocaleDateString('en-au', OPTS);
}

export default function Home() {
  // Display the real date.
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => setDate(new Date()));

    // Cleanup.
    return () => clearInterval(interval);
  }, [setDate]);

  return (
    <Box>
      <Typography
        variant={'h1'}
        sx={{
          mt: '25vh',
          mb: '10vh',
        }}
        align={'center'}
      >
        Welcome to Lan Admin Dashboard
      </Typography>

      <Typography variant={'h4'} align={'center'}>
        {getFormatDate(date)}
      </Typography>

      <Typography variant={'h5'} sx={{ mt: '10vh', }} align={'center'}>
        Use the buttons on the left to select different functions
      </Typography>
    </Box>
  )
}