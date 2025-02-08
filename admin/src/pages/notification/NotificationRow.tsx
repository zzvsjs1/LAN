import * as React from 'react';
import { useState } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  ACTION_OPERATION_TYPE,
  ACTION_TYPE,
  SubscriptionObj,
  subscriptionTypeToString
} from "../../common/SubscriptionContext";
import RowInnerElement from "./RowInnerElement";

type NotificationRowProps = {
  singleState: SubscriptionObj,
  dispatch: React.Dispatch<ACTION_TYPE>,
}

export default function NotificationRow({ singleState, dispatch }: NotificationRowProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <TableRow
        sx={{
          '& > *': { borderBottom: 'none' },
          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.05)' },
          cursor: 'pointer',
        }}
        onClick={() => setOpen(prevState => !prevState)}
      >
        <TableCell sx={{ borderBottom: 'none' }}>
          <IconButton size={'small'}>
            {/* Show different icon for open/close. */}
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell sx={{ borderBottom: 'none' }} component={'th'} scope={'row'}>
          {singleState.id}
        </TableCell>

        <TableCell sx={{ borderBottom: 'none' }} align={'right'}>
          {subscriptionTypeToString(singleState.type)}
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <IconButton
                color={'secondary'}
                // Delete this message.
                onClick={() => dispatch({ type: ACTION_OPERATION_TYPE.DELETE, payload: singleState.id })}
              >
                <DeleteIcon />
              </IconButton>

              {/* The actual content. */}
              <Box>
                <RowInnerElement singleState={singleState} />
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}