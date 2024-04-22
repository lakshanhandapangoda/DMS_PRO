import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAlignLeft,
  faBell,
  faSearch,
  faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import {
  Navbar,
  Button,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  NavLink,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { useHistory } from "react-router-dom";

const Topbar = ({ toggleSidebar }) => {
  const [topbarIsOpen, setTopbarOpen] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const history = useHistory();

  useEffect(() => {
    const storedUserName = localStorage.getItem("user_id");
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

  const handleLogin = (username) => {
    localStorage.setItem("user_id", username);
    setIsLoggedIn(true);
    setUserName(username);
  };

  return (
    <Navbar
      dark
      className="navbar shadow-sm p-3 mb-4  rounded"
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
        <Nav className="ml-auto" navbar>
          <span style={{ color: "white", fontSize: "15px" }} className="mt-2">
            <FontAwesomeIcon
              icon={faUser}
              style={{ marginRight: "5px", color: "white" }}
            />
            Welcome, {userName}
          </span>

          <NavItem className="mx-4 icon-wrapper">
            {/* <NavLink href="#">
              <FontAwesomeIcon icon={faBell} className="bell-icon" />
            </NavLink> */}
          </NavItem>
          {isLoggedIn ? (
            <NavItem className="mx-2" style={{ borderRadius: "10px" }}>
              <Button color="link" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} />
              </Button>
            </NavItem>
          ) : (
            <NavItem className="mx-2 icon-wrapper">
              <Dropdown isOpen={userDropdownOpen} toggle={toggleUserDropdown}>
                <DropdownToggle nav style={{ borderRadius: "50%" }}>
                  <FontAwesomeIcon icon={faUser} className="bell-icon" />
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
