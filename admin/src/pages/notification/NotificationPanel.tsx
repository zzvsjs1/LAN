import Box from "@mui/material/Box";
import { useContext } from "react";
import { ACTION_OPERATION_TYPE, SubscriptionContext, SubscriptionContextT } from "../../common/SubscriptionContext";
import Typography from "@mui/material/Typography";
import * as React from "react";
import Container from "@mui/material/Container";
import { Paper, Button } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import NotificationRow from "./NotificationRow";
import DeleteIcon from "@mui/icons-material/Delete";

export default function NotificationPanel() {
  const { state, dispatch } = useContext<SubscriptionContextT>(SubscriptionContext);

  return (
    <Box sx={{ p: '5rem' }}>
      <Container maxWidth={'xl'}>
        <Typography sx={{ m: '0 auto 0 auto' }} variant={'h2'}>
          Notification
        </Typography>

        {/* Delete all notifications */}
        {
          state.length !== 0
          &&
          <Button
            variant={'contained'}
            color={'secondary'}
            endIcon={<DeleteIcon />}
            onClick={() => dispatch({ type: ACTION_OPERATION_TYPE.CLEAN })}
          >
            Clear
          </Button>
        }

        {
          state.length === 0
          &&
          <Paper sx={{ p: '3rem' }}>
            <Typography variant={'h4'} align={'center'}>
              No notification
            </Typography>
          </Paper>
        }

        {
          state.length !== 0
          &&
          <TableContainer sx={{ mt: '1rem' }} component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {/* Fill the space for first column. */}
                  <TableCell />
                  <TableCell sx={{ fontWeight: 'bold' }}>Notification ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align={'right'}>Brief description</TableCell>
                </TableRow>
              </TableHead>

              {/* Show all the row */}
              <TableBody>
                {state.map(value => <NotificationRow key={value.id} singleState={value} dispatch={dispatch} />)}
              </TableBody>
            </Table>
          </TableContainer>
        }
      </Container>
    </Box>
  );
}