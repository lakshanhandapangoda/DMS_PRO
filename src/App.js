import React, { useState } from "react";
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

  return (
    <Router>
      <div className="App wrapper">
        {/* Conditional rendering of SideBar based on route */}
        <Route
          render={({ location }) =>
            location.pathname !== "/login" && location.pathname !== "/register" && (
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
              location.pathname !== "/login" && location.pathname !== "/register" && (
                <Content
                  toggleSidebar={toggleSidebar}
                  sidebarIsOpen={sidebarIsOpen}
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
