import Box from "@mui/material/Box";
import List from "@mui/material/List";
import React, { useRef, useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

interface Props {
  evseId: number;
}

export default function EVSEItem(props: Props) {
  let navigate = useNavigate();

  return (
    <Paper sx={{ background: "grey", width: "100%", maxHeight: "25vh" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignContent="center"
        padding={5}
      >
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
          EVSE {props.evseId}{" "}
        </Typography>

        <Button
          variant="contained"
          sx={{ width: "45vw", minHeight: "100%" }}
          onClick={() => {
            console.log("Naviaging to evse");
            navigate("/evses/" + props.evseId);
          }}
        >
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
            {" "}
            Details
          </Typography>
        </Button>
      </Stack>
    </Paper>
  );
}
