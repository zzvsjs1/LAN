import React from "react";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

type DrawerListItemProps = {
  name: string,
  path: string,
  icon: React.ReactNode,
  isOpen: boolean,
}

/**
 * Each item in drawer list.
 *
 * @param name
 * @param path
 * @param icon
 * @param isOpen
 */
export default function DrawerListItem({ name, path, icon, isOpen }: DrawerListItemProps) {
  const navigate = useNavigate();

  return (
    <ListItem
      title={name}
      sx={{ display: 'block' }}
      disablePadding
      onClick={() => navigate(path)}
    >
      <ListItemButton>
        <ListItemIcon>
          {icon}
        </ListItemIcon>

        {/* Hide the text */}
        <ListItemText primary={name} sx={{ opacity: isOpen ? 1 : 0 }} />
      </ListItemButton>
    </ListItem>
  );
}
