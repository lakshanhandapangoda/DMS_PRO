import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAlignLeft,
  faPowerOff,
  faUser,
  faAngleDown,
  faCogs,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import {
  Navbar,
  Button,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Tooltip,
} from "reactstrap";
import { useHistory } from "react-router-dom";

const Topbar = ({ toggleSidebar }) => {
  const [topbarIsOpen, setTopbarOpen] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const history = useHistory();
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setIsLoggedIn(true);
      setUserName(storedUserName);
    }
  }, []);

  const toggleTopbar = () => setTopbarOpen(!topbarIsOpen);
  const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);
  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");
    localStorage.removeItem("branchCode");
    setIsLoggedIn(false);
    setUserName("");
    history.push("/login");
  };
  const toggleTooltip = () => setTooltipOpen(!tooltipOpen);

  return (
    <Navbar
      dark
      className="navbar shadow-sm p-3 mb-4 rounded"
      expand="md"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backgroundColor: "#070f52",
      }}
    >
      <Button
        color="info"
        onClick={toggleSidebar}
        style={{ backgroundColor: "#848ed9" }}
      >
        <FontAwesomeIcon icon={faAlignLeft} />
      </Button>

      <NavbarToggler onClick={toggleTopbar} />
      <Collapse isOpen={topbarIsOpen} navbar>
        {/* <span style={{ color: "white", fontSize: "15px", marginLeft: "10px" }}>
          {location.pathname}
        </span> */}

        {location.pathname === "/user-maintenance" && (
          <span
            style={{ color: "white", fontSize: "15px", marginLeft: "10px" }}
          >
            <FontAwesomeIcon icon={faUser} className="me-2 mx-2" />
            User Maintenance
          </span>
        )}

        {location.pathname.includes("/assign-user") && (
          <span
            style={{ color: "white", fontSize: "15px", marginLeft: "10px" }}
          >
            <FontAwesomeIcon icon={faCogs} className="me-2 mx-2" />
            Assign Function
          </span>
        )}

        {location.pathname === "/" && (
          <span
            style={{ color: "white", fontSize: "15px", marginLeft: "10px" }}
          >
            <FontAwesomeIcon icon={faHome} className="me-2 mx-2" />
            Home
          </span>
        )}

        <Nav className="ml-auto" navbar>
          <span
            style={{ color: "white", fontSize: "15px", marginLeft: "10px" }}
            className="mt-2"
          >
            <FontAwesomeIcon
              icon={faUser}
              style={{ marginRight: "5px", color: "white" }}
            />
            {isLoggedIn ? `Hello, ${userName}!` : `Welcome, Guest!`}
          </span>

          {isLoggedIn ? (
            <NavItem className="mx-4" style={{ borderRadius: "50px" }}>
              <Button color="link" onClick={handleLogout} id="logoutTooltip">
                <FontAwesomeIcon icon={faPowerOff} />
              </Button>
              <Tooltip
                placement="bottom"
                isOpen={tooltipOpen}
                target="logoutTooltip"
                toggle={toggleTooltip}
              >
                Logout
              </Tooltip>
            </NavItem>
          ) : (
            <NavItem
              className="mx-4"
              style={{ borderRadius: "10%", backgroundColor: "white" }}
            >
              <Dropdown isOpen={userDropdownOpen} toggle={toggleUserDropdown}>
                <DropdownToggle nav style={{ borderRadius: "10" }}>
                  <FontAwesomeIcon
                    icon={faUser}
                    style={{ marginRight: "5px", color: "blue" }}
                  />
                  <FontAwesomeIcon
                    icon={faAngleDown}
                    style={{ color: "blue" }}
                  />
                </DropdownToggle>

                <DropdownMenu right>
                  <DropdownItem>
                    <Link to="/register">Register</Link>
                  </DropdownItem>
                  <DropdownItem>
                    <Link to="/login">Login</Link>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavItem>
          )}
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default Topbar;
