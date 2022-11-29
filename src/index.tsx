import React from "react";
import ReactDOM from "react-dom";
import App from "./app/App";

import "./index.css";

console.log("index file ran");

export const startTime = Date.now();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
