import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { debugContextDevtool } from "react-context-devtool";

const container = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  container
);

debugContextDevtool(container);
