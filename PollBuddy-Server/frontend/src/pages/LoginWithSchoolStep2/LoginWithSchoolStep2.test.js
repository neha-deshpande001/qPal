import React from "react";
import ReactDOM from "react-dom";
import LoginWithSchoolStep2 from "./LoginWithSchoolStep2";
import {BrowserRouter} from "react-router-dom";

// Create basic render test
it("renders without crashing", () => {
  // Create div element
  const div = document.createElement("div");
  // Render about on the div
  ReactDOM.render(
    <BrowserRouter>
      <LoginWithSchoolStep2 />
    </BrowserRouter>, div);
  // Clean unmount
  ReactDOM.unmountComponentAtNode(div);
});
