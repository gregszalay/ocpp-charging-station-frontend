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
import Container from "@mui/material/Container";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EVSEItem from "./util-components/Item";
import Typography from "@mui/material/Typography";

export default function EVSEList() {
  const [errorLoading, setErrorLoading] = useState<any>(null);
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
        (errorLoading) => {
          console.log(errorLoading);
          setIsLoaded(true);
          setErrorLoading(errorLoading);
        }
      );
  }, []);

  return (
    <Box margin={2} sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Typography
        variant="h1"
        component="div"
        padding={2}
        align="center"
        sx={{
          fontSize: 110,
          paddingBottom: 2,
          paddingTop: 2,
        }}
      >
        {errorLoading ? (
          <div>Failed to load page: {errorLoading.message}</div>
        ) : !isLoaded || !evses || evses.length === 0 ? (
          <Stack
            sx={{ height: "50vh" }}
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <CircularProgress color="info" />
          </Stack>
        ) : (
          <List>
            {evses.map((evse: any) => {
              return (
                <ListItem key={evse}>
                  <EVSEItem evseId={evse} />
                  <Divider />
                </ListItem>
              );
            })}
          </List>
        )}
      </Typography>
    </Box>
  );
}
