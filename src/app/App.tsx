import { ThemeProvider } from "@mui/material/styles";
import { Box, CssBaseline, useMediaQuery } from "@mui/material";

import EVSEList from "../evselist/EVSEList";
import React, { useRef, useState } from "react";

/***************************************************************************/

interface Props {}

/***************************************************************************/

function App(props: Props) {
  console.log("function App called");

  return <EVSEList />;
}

export default App;
