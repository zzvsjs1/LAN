import { updateUser, User } from "../../../backend/userUtils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toErrorPageException } from "../../../backend/errorUtils";
import TextDialog from "../../users/TextDialog";
import * as React from "react";
import UserAvatar from "../../users/UserAvatar";
import Typography from "@mui/material/Typography";
import { Button, Paper } from "@mui/material";
import Grid from "@mui/material/Grid";

type UserInnerRowProps = {
  user: User
}

/**
 * Display the signle user in notification page.
 */
export default function UserInnerRow({ user }: UserInnerRowProps) {
  const [thisUser, setThisUser] = useState<User>(user);
  const [showBlockDialog, setShowBlockDialog] = useState<boolean>(false);
  const [blockMsg, setBlockMsg] = useState<string>('');

  const navigate = useNavigate();

  const blockOrUnblockUser = async (block: boolean) => {
    try {
      await updateUser(thisUser.username, { isBlock: block });

      // Update the temp user object.
      thisUser.isBlock = block;
      setThisUser({ ...thisUser });

      if (block) {
        setBlockMsg(`Success block user "${thisUser.username}".`);
      } else {
        setBlockMsg(`Success unblock user "${thisUser.username}".`);
      }

      setShowBlockDialog(true);
    } catch (e: unknown) {
      toErrorPageException(navigate, e);
    }
  };

  return (
    <Paper variant={'outlined'}>
      {
        showBlockDialog
        &&
        <TextDialog
          title={'Block Status'}
          text={blockMsg}
          setShow={setShowBlockDialog}
        />
      }

      <Grid container sx={{ p: '2rem', alignItems: 'center' }}>
        <Grid item xs={1} >
          <UserAvatar src={thisUser.avatar} />
        </Grid>

        <Grid item xs={5} >
          <Typography sx={{ wordWrap: "break-word" }} variant={'inherit'}>
            {thisUser.username}
          </Typography>
        </Grid>

        <Grid item xs={5} >
          <Typography sx={{ wordWrap: "break-word" }} variant={'inherit'}>
            {thisUser.email}
          </Typography>
        </Grid>

        <Grid item xs={1}>
          {
            thisUser.isBlock
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
        </Grid>
      </Grid>
    </Paper>
  );
}