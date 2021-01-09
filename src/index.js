import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

// Bind to <div> element in host page.
// Note that the id is ciritical and the host
// page should have a <div> element with the id.
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("chat-widget-radyo-motel")
);
