import React, { Component, useState, useRef, useEffect } from "react";
import "mdbreact/dist/css/mdb.css";
import "./Dropdown.scss";
import { useNavigate } from "react-router-dom";

export default class Dropdown extends Component {
  render() {
    return (
      <DropdownButton />
    );
  }
}

function DropdownButton() {
  const [open, setOpen] = useState(false);
  function handleStateChange() {
    setOpen(!open);
  }
  return (
    <span>
      <span className="Dropdown-button button" onClick={handleStateChange}>Menu</span>
      {open && <DropdownMenu onStateChange={handleStateChange} />}
    </span>
  );
}

function useOutsideAlerter(ref, menuProps) {
  const navigate = useNavigate();
  useEffect(() => {
    // Close menu if click outside
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        menuProps.onStateChange();
      }
    }
    // Bind the event listener
    document.addEventListener("click", handleClickOutside);
    // Stop propagation to Logout (so we don't log out every menu click) only if logged in
    if(localStorage.getItem("loggedIn") === "true") {
      document.getElementById("logout").addEventListener("click",async function(e) {
        e.stopPropagation();
        const httpResponse = await fetch(process.env.REACT_APP_BACKEND_URL + "/users/logout", {
          method: "POST"
        });
        if(httpResponse.ok) {
          const response = httpResponse.json();
          console.log(response);
          if(response.result === "success") {
            //Logout has succeeded, Clear frontend user data
            localStorage.setItem("loggedIn", "false");
            localStorage.removeItem("lastName");
            localStorage.removeItem("userName");
            localStorage.removeItem("firstName");
          } else {
            console.log("Error Logging Out");
          }
          //Navigates after response so that the redirect does not interrupt response
          navigate("/");
          //Reloads the page so that the logged-in menu closes
          //history.go(0);
        }else {
          console.log("Error Logging Out");
        }
      });
    }
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref]);
}

function LoggedInMenu(props) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, props);
  return (
    <div className = "Dropdown" ref={wrapperRef}>
      <a href="/account">Account</a>
      <a href="/code">Enter Poll Code</a>
      <a href="/groups">Groups</a>
      <a href="/guide">Quick Start Guide</a>
      <a href="#" id="logout">Logout</a>
    </div>
    // Logout routes to '/' in the event listeners above
  );
}

function LoggedOutMenu(props) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, props);
  return (
    <div className = "Dropdown" ref={wrapperRef}>
      <a href="/login">Login</a>
      <a href="/register">Register</a>
      <a href="/guide">Quick Start Guide</a>
      <a href="/code">Enter Poll Code</a>
    </div>
  );
}

function DropdownMenu(props) {
  if(localStorage.getItem("loggedIn") === "true") {
    return LoggedInMenu(props);
  } else {
    return LoggedOutMenu(props);
  }
}
