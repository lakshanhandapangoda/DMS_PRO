import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartPlus,
  faCheckCircle,
  faBuilding,
  faUsers,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";
import { NavItem, NavLink, Nav } from "reactstrap";
import classNames from "classnames";
import { Link } from "react-router-dom";
import axios from "axios";
import baseURL from "../Auth/apiConfig";

const SideBar = ({ isOpen, toggle }) => {
  const [sidebarItems, setSidebarItems] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");
    const fetchData = async () => {
      try {
        const functionResponse = await axios.get(
          `${baseURL}AppUser/GetAssignedFunctions/${userId}/1`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSidebarItems(functionResponse.data);
      } catch (error) {
        if (error.response.status === 401) {
          window.location.href = "/login";
        }
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      className={classNames("sidebar", { "is-open": isOpen })}
      style={{ backgroundColor: "#040d36", fontSize: "14px" }}
    >
      <div className="sidebar-header" style={{ backgroundColor: "#040d36" }}>
        <span color="info" onClick={toggle} style={{ color: "#fff" }}>
          &times;
        </span>
        <div>
          <img
            src={require("../Auth/logo (2).png")}
            alt="Logo"
            style={{ width: "250px", height: "80px", margin: "auto" }}
          />
        </div>
      </div>
      <div className="side-menu" style={{ overflowY: "hidden" }}>
        <Nav
          vertical
          className="list-unstyled pb-3"
          style={{ overflowY: "hidden" }}
        >
          {sidebarItems.map((item, index) => {
            if (item.functionName === "Item Request") {
              return (
                <NavItem key={index}>
                  <NavLink
                    tag={Link}
                    to={"/item-request"}
                    style={{ color: "#fff" }}
                  >
                    <FontAwesomeIcon icon={faCartPlus} className="mr-2" />
                    Item Request
                  </NavLink>
                </NavItem>
              );
            } else if (item.functionName === "User Maintenance") {
              return (
                <NavItem key={index}>
                  <NavLink
                    tag={Link}
                    to={"/user-maintenance"}
                    style={{ color: "#fff" }}
                  >
                    <FontAwesomeIcon icon={faUsers} className="mr-2" />
                    User Management
                  </NavLink>
                </NavItem>
              );
            } else if (item.functionName === "Dashboard") {
              return (
                <NavItem key={index}>
                  <NavLink tag={Link} to={"/"} style={{ color: "#fff" }}>
                    <FontAwesomeIcon icon={faChartBar} className="mr-2" />
                    Dashboard
                  </NavLink>
                </NavItem>
              );
            }
            return null;
          })}
          {/* <NavItem>
            <NavLink tag={Link} to={"/request-approval"} style={{ color: "#fff" }}>
              <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
              Request Approval
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to={"/request-department"} style={{ color: "#fff" }}>
              <FontAwesomeIcon icon={faBuilding} className="mr-2" />
              Request Department
            </NavLink>
          </NavItem> */}
        </Nav>
      </div>
    </div>
  );
};

// Set the displayName for the SideBar component
SideBar.displayName = "SideBar";

export default SideBar;
