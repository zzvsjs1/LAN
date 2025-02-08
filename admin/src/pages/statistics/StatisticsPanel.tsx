import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import UserPerDayChart from "./charts/UserPerDayChart";
import UserPostReactionChart from "./charts/UserPostReactionChart";
import ProfileVisitsChart from "./charts/ProfileVisitsChart";
import { TopTenFollowedChart } from "./charts/TopTenFollowedChart";

/**
 * One page to show all four charts.
 */
export default function StatisticsPanel() {
  return (
    <Container maxWidth={'lg'} sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={2}>
        {/* Show user per day. */}
        <Grid sx={{ position: 'relative' }} item xs={12} md={12} lg={12}>
          <UserPerDayChart />
        </Grid>

        {/* User post reaction metrics */}
        <Grid sx={{ position: 'relative' }} item xs={12} md={12} lg={12}>
          <UserPostReactionChart />
        </Grid>

        {/* Profile visits */}
        <Grid sx={{ position: 'relative' }} item xs={12} md={12} lg={12}>
          <ProfileVisitsChart />
        </Grid>

        {/* Follower metrics for each of the user. The top 10 followed */}
        <Grid sx={{ position: 'relative' }} item xs={12} md={12} lg={12}>
          <TopTenFollowedChart />
        </Grid>
      </Grid>
    </Container>
  );
}