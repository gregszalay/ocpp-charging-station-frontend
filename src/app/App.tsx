import { ThemeProvider } from "@mui/material/styles";
import { Box, CssBaseline, useMediaQuery } from "@mui/material";

import EVSEList from "../evselist/EVSEList";
import React, { useRef, useState } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import EVSE from "../evse/EVSE";

/***************************************************************************/

interface Props {}

/***************************************************************************/

function App(props: Props) {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EVSEList />} />
        <Route path="/evses/:evseId" element={<EVSE />} />
      </Routes>
    </Router>
  );
}

export default App;
