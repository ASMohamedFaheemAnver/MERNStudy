import React, { Fragment } from "react";
import spinner from "./spinner.gif";

export default () => (
  <Fragment>
    <img
      alt=""
      src={spinner}
      style={{ width: "200px", margin: "auto", display: "block" }}
    ></img>
  </Fragment>
);
