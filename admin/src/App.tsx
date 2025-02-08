import Box from '@mui/material/Box';
import { Route, Routes } from "react-router-dom";
import DashBoardAppBar from "./pages/common/Header/DashBoardAppBar";
import { DrawerHeader } from "./pages/common/Header/LanAppBarAndDrawer";
import Home from './pages/Home';
import Footer from "./pages/common/Footer";
import UsersPanel from "./pages/users/UsersPanel";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import PostAndReplyPanel from "./pages/postsAndReplies/PostAndReplyPanel";
import StatisticsPanel from "./pages/statistics/StatisticsPanel";
import NotificationPanel from "./pages/notification/NotificationPanel";
import NoThisPagePanel from "./pages/nothispage/NoThisPagePanel";

/**
 * Create the router also the app bar.
 */
function App() {
  return (
    // The whole page is a flex box.
    <Box sx={{ display: 'flex' }}>
      {/* The left drawer and the header. */}
      <DashBoardAppBar />

      {/* Main part */}
      <Box
        component={'main'}
        sx={{
          backgroundColor: (theme) =>
            // Change background color depend on theme.
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          // Fill the whole page.
          height: '100vh',
          overflow: 'auto',
        }}
      >
        {/* Used to fill the space. */}
        <Box sx={{ flexGrow: 1, }}>
          {/* Fill the space */}
          <DrawerHeader />

          {/* To different page */}
          <Routes>
            <Route path={'/'} element={<Home />} />
            <Route path={'/users'} element={<UsersPanel />} />
            <Route path={'/post-and-reply'} element={<PostAndReplyPanel />} />
            <Route path={'/statistics'} element={<StatisticsPanel />} />
            <Route path={'/notification'} element={<NotificationPanel />} />
            <Route path={'/error'} element={<ErrorPage />} />
            <Route path="*" element={<NoThisPagePanel />} />
          </Routes>
        </Box>

        {/* Footer in main content area. */}
        <Footer />
      </Box>
    </Box>
  );
}

export default App;
