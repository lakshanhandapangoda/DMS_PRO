import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBriefcase,
  faCopy,
  faCartPlus,
  faCheckCircle,
  faBuilding,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { NavItem, NavLink, Nav } from "reactstrap";
import classNames from "classnames";
import { Link } from "react-router-dom";

import SubMenu from "./SubMenu";

const SideBar = ({ isOpen, toggle }) => (
  <div
    className={classNames("sidebar", { "is-open": isOpen })}
    style={{ backgroundColor: "#040d36", fontSize: "14px" }}
  >
    <div className="sidebar-header" style={{ backgroundColor: "#040d36" }}>
      <span color="info" onClick={toggle} style={{ color: "#fff" }}>
        &times;
      </span>
      <div>
        {/* <img src={require("../Auth/logo (2).png")} alt="Logo" style={{ width: "250px", height: "80px", margin: "auto" }} /> */}
      </div>
    </div>
    <div className="side-menu" style={{ overflowY: "hidden" }}>
      <Nav
        vertical
        className="list-unstyled pb-3"
        style={{ overflowY: "hidden" }}
      >
        <p style={{ color: "#fff" }}>Dummy Heading</p>
        <SubMenu title="Home" icon={faHome} items={submenus[0]} />
        <NavItem>
          <NavLink tag={Link} to={"/about"} style={{ color: "#fff" }}>
            <FontAwesomeIcon icon={faBriefcase} className="mr-2" />
            About
          </NavLink>
        </NavItem>
        <SubMenu title="Pages" icon={faCopy} items={submenus[1]} />

        <NavItem>
          <NavLink tag={Link} to={"/item-request"} style={{ color: "#fff" }}>
            <FontAwesomeIcon icon={faCartPlus} className="mr-2" />
            Item Request
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            tag={Link}
            to={"/request-approval"}
            style={{ color: "#fff" }}
          >
            <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
            Request Approval
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            tag={Link}
            to={"/request-department"}
            style={{ color: "#fff" }}
          >
            <FontAwesomeIcon icon={faBuilding} className="mr-2" />
            Request Department
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            tag={Link}
            to={"/user-maintenance"}
            items={submenus[1]}
            style={{ color: "#fff" }}
          >
            <FontAwesomeIcon icon={faUsers} className="mr-2" />
            User Management
          </NavLink>
        </NavItem>
      </Nav>
    </div>
  </div>
);

const submenus = [
  [
    {
      title: "Home 1",
      target: "Home-1",
    },
    {
      title: "Home 2",
      target: "Home-2",
    },
    {
      title: "Home 3",
      target: "Home-3",
    },
  ],
  [
    {
      title: "Page 1",
      target: "Page-1",
    },
    {
      title: "Page 2",
      target: "Page-2",
    },
  ],
];

export default SideBar;
