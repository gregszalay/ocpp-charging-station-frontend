import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import InboxIcon from "@mui/icons-material/Inbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import React, { useRef, useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function EVSEList() {
  let navigate = useNavigate();
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [evses, setEvses] = useState<any[]>(["1", "2", "3"]);

  React.useEffect(() => {
    fetch("http://127.0.0.1:8090/evses/active/ids")
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then(
        (result) => {
          setIsLoaded(true);
          console.log(result);
          setEvses(result);
        },
        (error) => {
          console.log(error);
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded || !evses || evses.length === 0) {
    return (
      <Stack
        sx={{ height: "50vh" }}
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress color="info" />
      </Stack>
    );
  } else {
    return (
      <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        <nav aria-label="main mailbox folders">
          <List>
            {evses.map((evse: any) => {
              return (
                <ListItem key={evse} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary={"EVSE " + evse} />
                  </ListItemButton>
                  <Button
                    onClick={() => {
                      console.log("Naviaging to evse");
                      navigate("/evses/" + evse);
                    }}
                  >
                    Hello
                  </Button>
                  <Divider />
                </ListItem>
              );
            })}
          </List>
        </nav>
      </Box>
    );
  }
}
