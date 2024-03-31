import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignLeft, faBell, faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import { Switch, Route, Link } from "react-router-dom";
import Login from '../Auth/Login';
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
  DropdownItem
} from "reactstrap";

const Topbar = ({ toggleSidebar }) => {
  const [topbarIsOpen, setTopbarOpen] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false); // State for user dropdown

  const toggleTopbar = () => setTopbarOpen(!topbarIsOpen);
  const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen); // Function to toggle user dropdown

  return (
    <Navbar
    // color="info" // Set the background color
    dark // Set text color to light
      className="navbar shadow-sm p-3 mb-4  rounded"
      expand="md"
      style={{ position: "sticky", top: 0, zIndex: 1000 ,backgroundColor: "#070f52"}}
    >
      <Button color="info" onClick={toggleSidebar} style={{ backgroundColor: "#848ed9" }}>
        <FontAwesomeIcon icon={faAlignLeft} />
      </Button>
      <NavbarToggler onClick={toggleTopbar} />
      <Collapse isOpen={topbarIsOpen} navbar>
        <Nav className="ml-auto" navbar>
          <NavItem className="mx-2">
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroupText>
              </InputGroupAddon>
              <Input placeholder="Search" />
            </InputGroup>
          </NavItem>
          <NavItem className="mx-4 icon-wrapper" >
          <NavLink href="#" >
              <FontAwesomeIcon icon={faBell} className="bell-icon"/>
            </NavLink>
          </NavItem>
          <NavItem className="mx-2 icon-wrapper" >
            <Dropdown isOpen={userDropdownOpen} toggle={toggleUserDropdown}>
              <DropdownToggle nav style={{ borderRadius: "50%" }}>
                <FontAwesomeIcon icon={faUser} className="bell-icon"/>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>
                  <Link to="/profile">Profile</Link>
                </DropdownItem>
                <DropdownItem>
                  <Link to="/settings">Settings</Link>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem>
                  <Link to="/register">Register</Link>
                </DropdownItem>
                <DropdownItem>
                  <Link to="/login">Login</Link>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default Topbar;
