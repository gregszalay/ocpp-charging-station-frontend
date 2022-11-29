import Box from "@mui/material/Box";
import React, { useRef, useState } from "react";
import Stack from "@mui/material/Stack";
import { CircularProgress } from "@mui/material";
import { EVSEStatusDataForUI } from "./typedefs/EVSEStatusDataForUI";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Hidden from "@mui/material/Hidden";

interface Props {
  evseId: number;
}

export default function EVSEStatus(props: Props) {
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isRFIDReadInProgressStart, setIsRFIDReadInProgressStart] =
    useState<boolean>(false);
  const [isRFIDReadInProgressStop, setIsRFIDReadInProgressStop] =
    useState<boolean>(false);
  const [evseStatusInfo, setEvseStatusInfo] = useState<EVSEStatusDataForUI>();

  React.useEffect(() => {
    setInterval(() => {
      if (!isRFIDReadInProgressStart && !isRFIDReadInProgressStop) {
        fetch("http://127.0.0.1:8090/chargestatus/" + props.evseId)
          .then((res) => {
            console.log(res);
            return res.json();
          })
          .then(
            (result) => {
              setIsLoaded(true);
              console.log(result);
              setEvseStatusInfo(result);
            },
            (error) => {
              console.log(error);
              setIsLoaded(true);
              setError(error);
            }
          );
      }
    }, 1000);
  }, [isRFIDReadInProgressStart, isRFIDReadInProgressStop, props.evseId]);

  const startCharge = () => {
    console.info("You clicked the startcharge Chip.");
    setIsRFIDReadInProgressStart(true);
  };
  const stopCharge = () => {
    console.info("You clicked the stopcharge Chip.");
    setIsRFIDReadInProgressStop(true);
  };

  const readRFIDAndStart = (rfid: string) => {
    console.info("You clicked the startcharge Chip.");
    fetch("http://127.0.0.1:8090/start/" + props.evseId + "/rfid/" + rfid, {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then((res) => {
        console.log("Start message sent successfully");
      })
      .catch((error) => console.log("Error: ", error))
      .finally(() => setIsRFIDReadInProgressStart(false));
  };
  const readRFIDAndStop = (rfid: string) => {
    console.info("You clicked the stopcharge Chip.");
    fetch("http://127.0.0.1:8090/stop/" + props.evseId + "/rfid/" + rfid, {
      method: "POST",
      body: JSON.stringify({}),
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
  } else if (!isLoaded || !evseStatusInfo) {
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
      <Hidden>
        <TextField
          id="filled-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          variant="filled"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            readRFIDAndStart(event.target.value);
          }}
          autoFocus
          hidden
        />
      </Hidden>
    );
  } else if (isRFIDReadInProgressStop) {
    return (
      <TextField
        id="filled-password-input"
        label="Password"
        type="password"
        autoComplete="current-password"
        variant="filled"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          readRFIDAndStop(event.target.value);
        }}
        autoFocus
        hidden
      />
    );
  } else {
    return (
      <Stack direction="row">
        <Chip
          label={
            evseStatusInfo.isEVConnected === 1 ? "Connected" : "Not Connected"
          }
        />
        <Chip
          label={
            evseStatusInfo.isChargingEnabled === 1
              ? "Charging permitted"
              : "Charging not permitted"
          }
        />
        <Chip
          label={"POWER: (kW)" + evseStatusInfo.PowerActiveImport_kw_float}
        />
        <Chip
          label={"ENERGY (kWh): " + evseStatusInfo.EnergyActiveNet_kwh_float}
        />
        {evseStatusInfo.isError === 1 ? <Chip label="Error" /> : ""}
        <Chip label="Start Charge" onClick={() => startCharge()} />
        <Chip
          label="Stop Charge"
          variant="outlined"
          onClick={() => stopCharge()}
        />
      </Stack>
    );
  }
}
