import * as React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import UserAvatar from "./UserAvatar";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { useState } from "react";
import TextDialog from "./TextDialog";
import { updateUser, User } from "../../backend/userUtils";
import { useNavigate } from "react-router-dom";
import { toErrorPageException } from "../../backend/errorUtils";

type UserRowProps = {
  user: User,
  fetchData: () => Promise<void>,
}

export function UserRow({ user, fetchData }: UserRowProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showBlockDialog, setShowBlockDialog] = useState<boolean>(false);
  const [blockMsg, setBlockMsg] = useState<string>('');

  const navigate = useNavigate();

  const blockOrUnblockUser = async (block: boolean) => {
    try {
      // Block or unblock the user.
      await updateUser(user.username, { isBlock: block });
      await fetchData();

      if (block) {
        setBlockMsg(`Success block user "${user.username}".`);
      } else {
        setBlockMsg(`Success unblock user "${user.username}".`);
      }

      setShowBlockDialog(true);
    } catch (e: unknown) {
      toErrorPageException(navigate, e);
    }
  };

  return (
    <>
      {
        showPassword
        &&
        <TextDialog title={'Password Hash'} text={user.password} setShow={setShowPassword} />
      }

      {
        showBlockDialog
        &&
        <TextDialog
          title={'Block Status'}
          text={blockMsg}
          setShow={setShowBlockDialog}
        />
      }

      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell component={'th'} scope={'row'}>
          <UserAvatar src={user.avatar} />
        </TableCell>

        <TableCell sx={{ maxWidth: '200px' }} align={'right'}>
          <Typography sx={{ wordWrap: "break-word" }} variant={'inherit'}>
            {user.username}
          </Typography>
        </TableCell>

        <TableCell sx={{ maxWidth: '250px' }} align={'right'}>
          <Typography sx={{ wordWrap: "break-word" }} variant={'inherit'}>
            {user.email}
          </Typography>
        </TableCell>

        <TableCell align={'right'}>
          <Button variant={'contained'} onClick={() => setShowPassword(true)}>
            Show
          </Button>
        </TableCell>

        <TableCell align={'right'}>
          {
            user.isBlock
              ?
              <Button
                variant={'contained'}
                color={'success'}
                onClick={async () => await blockOrUnblockUser(false)}
              >
                Unblock
              </Button>
              :
              <Button
                variant={'contained'}
                color={'secondary'}
                onClick={async () => await blockOrUnblockUser(true)}
              >
                Block
              </Button>
          }
        </TableCell>
      </TableRow>
    </>
  )
}