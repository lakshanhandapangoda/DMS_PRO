import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import SideBar from "./components/sidebar/SideBar";
import Content from "./components/content/Content";
import LoginPage from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import "./App.css";

const App = () => {
  const [sidebarIsOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarIsOpen);
  const [apiUrl, setApiUrl] = useState("");

  useEffect(() => {
    const fetchConfigURL = async () => {
      try {
        const response = await fetch("/config.txt"); // Assuming config.txt is in the public folder
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const text = await response.text();
        // Extracting the URL directly from the text content
        const url = text.trim();
        setApiUrl(url);
        localStorage.setItem("configUrl", url); // Optionally, save the URL to local storage
      } catch (error) {
        console.error(
          "There was a problem fetching or parsing the file:",
          error
        );
      }
    };

    fetchConfigURL();
  }, []);
  console.log("aa", apiUrl);
  return (
    <Router>
      <div className="App wrapper">
        {/* Conditional rendering of SideBar based on route */}
        <Route
          render={({ location }) =>
            location.pathname !== "/login" &&
            location.pathname !== "/register" && (
              <SideBar toggle={toggleSidebar} isOpen={sidebarIsOpen} />
            )
          }
        />
        <Switch>
          {/* Route for the login page */}
          <Route path="/login" component={LoginPage} />
          {/* Route for the register page */}
          <Route path="/register" component={Register} />
          {/* Route for other content */}
          <Route
            render={({ location }) =>
              location.pathname !== "/login" &&
              location.pathname !== "/register" && (
                <Content
                  toggleSidebar={toggleSidebar}
                  sidebarIsOpen={sidebarIsOpen}
                  apiUrl={apiUrl} // Pass the apiUrl prop to Content component
                />
              )
            }
          />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
