import Box from "@mui/material/Box";
import React, { ReactElement, useRef, useState } from "react";
import Stack from "@mui/material/Stack";
import { CircularProgress } from "@mui/material";
import { EVSEStatusDataForUI } from "./typedefs/EVSEStatusDataForUI";
import { EVSEStatus } from "./constants/EVSEStatus";
import { RFID } from "./typedefs/RFID";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Hidden from "@mui/material/Hidden";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import {
  BrowserRouter as Router,
  Route,
  Link,
  useParams,
} from "react-router-dom";

export default function EVSE() {
  let { evseId } = useParams();
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isRFIDReadInProgressStart, setIsRFIDReadInProgressStart] =
    useState<boolean>(false);
  const [isRFIDReadInProgressStop, setIsRFIDReadInProgressStop] =
    useState<boolean>(false);
  const [evseInfo, setevseInfo] = useState<EVSEStatusDataForUI>();

  React.useEffect(() => {
    setInterval(() => {
      if (!isRFIDReadInProgressStart && !isRFIDReadInProgressStop) {
        fetch("http://127.0.0.1:8090/chargestatus/" + evseId)
          .then((res) => {
            console.log(res);
            return res.json();
          })
          .then(
            (result) => {
              setIsLoaded(true);
              console.log(result);
              console.log(result.isEVConnected);
              console.log(result.energyActiveNet_kwh_float);
              console.log(result.powerActiveImport_kw_float);
              setevseInfo(result);
            },
            (error) => {
              console.log(error);
              setIsLoaded(true);
              setError(error);
            }
          );
      }
    }, 1000);
  }, [isRFIDReadInProgressStart, isRFIDReadInProgressStop, evseId]);

  function getEVSEStatus(evse: EVSEStatusDataForUI): ReactElement {
    if (evse.isError === 1) {
      return (
        <React.Fragment>Error: Please contact our support team.</React.Fragment>
      );
    }
    if (evse.isCharging === 1) {
      return <React.Fragment>EVSE is charging</React.Fragment>;
    }
    if (evse.isChargingEnabled === 1) {
      return <React.Fragment>Initializing charging process</React.Fragment>;
    }
    if (evse.isEVConnected === 1) {
      return <React.Fragment>EV is connected</React.Fragment>;
    }
    return <React.Fragment>EV is not connected</React.Fragment>;
  }

  const startCharge = () => {
    console.info("You clicked the startcharge Chip.");
    setIsRFIDReadInProgressStart(true);
  };
  const stopCharge = () => {
    console.info("You clicked the stopcharge Chip.");
    setIsRFIDReadInProgressStop(true);
  };

  const readRFIDAndStart = (rfid: RFID) => {
    console.info("You clicked the startcharge Chip.");
    fetch("http://127.0.0.1:8090/start/" + evseId, {
      method: "POST",
      mode: "no-cors", // no-cors, *cors, same-origin
      body: JSON.stringify(rfid),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then((res) => {
        console.log("Start message sent successfully");
      })
      .catch((error) => console.log("Error: ", error))
      .finally(() => setIsRFIDReadInProgressStart(false));
  };
  const readRFIDAndStop = (rfid: RFID) => {
    console.info("You clicked the stopcharge Chip.");
    fetch("http://127.0.0.1:8090/stop/" + evseId, {
      method: "POST",
      mode: "no-cors", // no-cors, *cors, same-origin
      body: JSON.stringify(rfid),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then((res) => {
        console.log("Stop message sent successfully");
      })
      .catch((error) => console.log("Error: ", error))
      .finally(() => setIsRFIDReadInProgressStop(false));
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded || !evseInfo) {
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
  } else if (isRFIDReadInProgressStart) {
    return (
      <Box>
        <TextField
          id="filled-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          variant="filled"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.value.length >= 10) {
              readRFIDAndStart({ rfid: event.target.value });
            }
          }}
          autoFocus
          hidden
        />
        <Typography
          variant="h1"
          component="div"
          padding={2}
          align="center"
          sx={{
            fontSize: 150,
            paddingBottom: 2,
            paddingTop: 2,
          }}
        >
          Please touch RFID card to the reader
        </Typography>
      </Box>
    );
  } else if (isRFIDReadInProgressStop) {
    return (
      <Box>
        <TextField
          id="filled-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          variant="filled"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.value.length >= 10) {
              readRFIDAndStop({ rfid: event.target.value });
            }
          }}
          autoFocus
          hidden
        />
        <Typography
          variant="h1"
          component="div"
          padding={2}
          align="center"
          sx={{
            fontSize: 150,
            paddingBottom: 2,
            paddingTop: 2,
          }}
        >
          Please touch RFID card to the reader
        </Typography>
      </Box>
    );
  } else {
    return (
      <Box sx={{ m: 1, height: "100vh", width: "99%" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper sx={{ background: "grey" }}>
              <Typography
                variant="h1"
                component="div"
                padding={2}
                align="center"
                sx={{
                  fontSize: 150,
                  paddingBottom: 2,
                  paddingTop: 2,
                }}
              >
                {getEVSEStatus(evseInfo)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper
              sx={{ background: "grey", fontSize: 106, fontWeight: "bold" }}
            >
              <Typography
                variant="h1"
                component="div"
                padding={2}
                align="center"
                sx={{
                  fontSize: 195,
                  paddingBottom: 10,
                  paddingTop: 10,
                }}
              >
                {evseInfo.powerActiveImport_kw_float.toFixed(2) + " kW"}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper
              sx={{ background: "grey", fontSize: 106, fontWeight: "bold" }}
            >
              <Typography
                variant="h1"
                component="div"
                padding={2}
                align="center"
                sx={{
                  fontSize: 195,
                  paddingBottom: 10,
                  paddingTop: 10,
                }}
              >
                {evseInfo.energyActiveNet_kwh_float.toFixed(2) + " kWh"}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Button
              sx={{ width: "100%" }}
              variant="contained"
              onClick={() => startCharge()}
            >
              <Typography
                variant="h1"
                component="div"
                padding={2}
                align="center"
                sx={{
                  fontSize: 50,
                  paddingBottom: 15,
                  paddingTop: 15,
                }}
              >
                Start Charge
              </Typography>
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              onClick={() => stopCharge()}
              sx={{ width: "100%" }}
            >
              <Typography
                variant="h1"
                component="div"
                padding={2}
                align="center"
                sx={{
                  fontSize: 50,
                  paddingBottom: 15,
                  paddingTop: 15,
                }}
              >
                Stop Charge
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  }
}
