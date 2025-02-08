import { Badge, IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SubscriptionContext, SubscriptionContextT } from "../../../common/SubscriptionContext";

const DEFAULT_TITLE = 'LAN Admin Dashboard';

export default function NotificationBtn() {
  const { state } = useContext<SubscriptionContextT>(SubscriptionContext);

  const navigate = useNavigate();
  const toNotificationPage = () => navigate('/notification');

  // Change the web title.
  useEffect(() => {
    if (state.length === 0) {
      document.title = DEFAULT_TITLE;
    } else {
      document.title = `[🔔 ${state.length}] ${DEFAULT_TITLE}`;
    }
  }, [state]);

  return (
    <IconButton
      size={'large'}
      color={'inherit'}
      onClick={() => toNotificationPage()}
    >
      {/* Number of notifications */}
      <Badge badgeContent={state.length} color={'error'}>
        <NotificationsIcon />
      </Badge>
    </IconButton>
  );
}