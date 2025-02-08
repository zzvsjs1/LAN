import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { UserRow } from "./UserRow";
import { useCallback, useEffect, useState } from "react";
import { getAllUsers, User } from "../../backend/userUtils";
import { useNavigate } from "react-router-dom";
import { toErrorPageException } from "../../backend/errorUtils";

const BOLD_SX = { fontWeight: 'bold' };

export default function UsersPanel() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setAllUsers(await getAllUsers());
    } catch (e: unknown) {
      toErrorPageException(navigate, e);
    }
  }, [setAllUsers, navigate]);

  useEffect(() => {
    fetchData().catch(console.log);
  }, [fetchData]);

  return (
    <Box sx={{ p: '5rem' }}>
      {/* Title */}
      <Typography sx={{ m: '0 auto 2rem auto' }} variant={'h2'}>
        All users
      </Typography>

      {
        allUsers.length === 0
          ?
          <Paper sx={{ p: '3rem' }}>
            <Typography align={'center'} variant={'h4'}>
              No user in backend.
            </Typography>
          </Paper>
          :
          // The actual table.
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={BOLD_SX}>
                    Avatar
                  </TableCell>
                  <TableCell sx={BOLD_SX} align='right'>
                    Username
                  </TableCell>
                  <TableCell sx={BOLD_SX} align='right'>
                    Email
                  </TableCell>
                  <TableCell sx={BOLD_SX} align='right'>
                    Password Hash
                  </TableCell>
                  <TableCell sx={BOLD_SX} align='right'>
                    Block
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {/* Add each user in here. */}
                {allUsers.map((user: User) => <UserRow key={user.username} user={user} fetchData={fetchData} />)}
              </TableBody>
            </Table>
          </TableContainer>
      }
    </Box>
  );
}