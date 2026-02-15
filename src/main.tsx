import React from "react";
import ReactDOM from "react-dom/client";
import TitleBar from "./components/TitleBar";
import "./main.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <TitleBar />
  </React.StrictMode>,
);
