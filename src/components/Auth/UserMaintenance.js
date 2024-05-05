import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel"; // Import TableSortLabel
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import baseURL from "./apiConfig";
import Card from "react-bootstrap/Card";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";

import {
  faUser,
  faPlus,
  faUnlock,
  faUserAltSlash,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function UserMaintenance() {
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState(""); // State to store sorting column
  const [sortDirection, setSortDirection] = useState("asc"); // State to store sorting direction
  const apiUrl = process.env.REACT_APP_API_URL;
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const branch = localStorage.getItem("branchCode");

      const response = await axios.get(`${baseURL}AppUser/GetUsers/${branch}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);

      if (error.response.status === 401) {
        window.location.href = "/login";
      }
      setShowAlert({
        type: "error",
        message: error.response.data.toString(),
      });
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.branchCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updateUserStatus = async (userId, branchCode, userStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${baseURL}AppUser/UpdateUserStatus`,
        {
          userId: userId,
          branchCode: branchCode,
          userStatus: userStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers();

      console.log("User status updated successfully.");
      setShowAlert({
        type: "success",
        message: "User status updated successfully.",
      });
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      if (error.response.status === 401) {
        window.location.href = "/login";
      }
      setShowAlert({
        type: "error",
        message: error.response.data.toString(),
      });
      setTimeout(() => setShowAlert(false), 3000);
      console.error("An error occurred while processing your request.", error);
    }
  };

  const handleResetPassword = async (user) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${baseURL}AppUser/PasswordRest`,
        [user.userId, user.branchCode],
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUsers();
      console.log("Password reset request sent successfully.");
      setShowAlert({
        type: "success",
        message: "Password reset request sent successfully.",
      });
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      if (error.response.status === 401) {
        window.location.href = "/login";
      }
      setShowAlert({
        type: "error",
        message: error.response.data.toString(),
      });
      setTimeout(() => setShowAlert(false), 3000);
      console.error("An error occurred while processing your request.", error);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSortChange = (column) => {
    // If clicking on the same column, reverse sort direction
    if (column === sortBy) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  const sortUsers = (a, b) => {
    if (sortBy === "") return 0;

    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (aValue < bValue) {
      return sortDirection === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === "asc" ? 1 : -1;
    }
    return 0;
  };

  const sortedUsers = filteredUsers.sort(sortUsers);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const visibleUsers = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  return (
    <div>
      <div>
        <div className="flex-fill ml-3 mx-4">
          <Card>
            {/* <Card.Header as="h6">
              <FontAwesomeIcon icon={faUser} className="me-2 mx-2" />
              User Maintenance
            </Card.Header> */}

            {/* Display the alert when showAlert is true */}
            {showAlert && (
              <div
                style={{
                  position: "fixed",
                  top: "25px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 9999,
                }}
              >
                <div
                  style={{
                    backgroundColor:
                      showAlert.type === "success" ? "#d4edda" : "#f8d7da",
                    color: showAlert.type === "success" ? "#155724" : "#721c24",
                    padding: "10px",
                    borderRadius: "5px",
                    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.5)",
                  }}
                >
                  <strong>
                    {showAlert.type === "success" ? "Success:" : "Error:"}
                  </strong>{" "}
                  {showAlert.message}
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setShowAlert(false)}
                    style={{
                      height: "40px",
                      marginLeft: "10px",
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  ></button>
                </div>
              </div>
            )}

            <Card.Body>
              {/* Creative search field */}
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <div className="input-group-append">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faSearch} />
                  </span>
                </div>
              </div>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table" size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        style={{
                          fontWeight: "bold",
                          backgroundColor: "#3d3d3d",
                          color: "white",
                        }}
                        align="left"
                      >
                        <TableSortLabel
                          active={sortBy === "userId"}
                          direction={
                            sortBy === "userId" ? sortDirection : "asc"
                          }
                          onClick={() => handleSortChange("userId")}
                          style={{
                            fontWeight: "bold",
                            backgroundColor: "#3d3d3d",
                            color: "white",
                            cursor: "pointer",
                          }}
                        >
                          ServiceNo
                        </TableSortLabel>
                      </TableCell>
                      <TableCell
                        style={{
                          fontWeight: "bold",
                          backgroundColor: "#3d3d3d",
                          color: "white",
                        }}
                        align="left"
                      >
                        <TableSortLabel
                          active={sortBy === "userName"}
                          direction={
                            sortBy === "userName" ? sortDirection : "asc"
                          }
                          onClick={() => handleSortChange("userName")}
                          style={{
                            fontWeight: "bold",
                            backgroundColor: "#3d3d3d",
                            color: "white",
                            cursor: "pointer",
                          }}
                        >
                          User Name
                        </TableSortLabel>
                      </TableCell>
                      <TableCell
                        style={{
                          fontWeight: "bold",
                          backgroundColor: "#3d3d3d",
                          color: "white",
                        }}
                        align="center"
                      ></TableCell>
                    </TableRow>
                  </TableHead>
                  <tbody>
                    {visibleUsers.map((user, index) => (
                      <StyledTableRow key={index}>
                        <TableCell align="left">{user.userId}</TableCell>
                        <TableCell align="left">{user.userName}</TableCell>
                        <TableCell align="left">
                          <Link
                            to={{
                              pathname: `/assign-user/${user.userId}`,
                              state: { user: user },
                            }}
                          >
                            <Button
                              variant="outline-secondary"
                              style={{
                                padding: "0.25rem 0.5rem",
                                fontSize: "0.75rem",
                              }}
                              className="mr-2 mx-1"
                            >
                              <FontAwesomeIcon icon={faPlus} /> Assign
                            </Button>
                          </Link>

                          <Button
                            variant="outline-warning"
                            style={{
                              padding: "0.25rem 0.5rem",
                              fontSize: "0.75rem",
                            }}
                            className="mr-2 mx-1"
                            onClick={() => handleResetPassword(user)}
                          >
                            <FontAwesomeIcon icon={faUnlock} /> Reset
                          </Button>

                          {user.userStatus !== 2 && (
                            <Button
                              style={{
                                padding: "0.25rem 0.5rem",
                                fontSize: "0.75rem",
                                width: "80px",
                              }}
                              variant={
                                user.userStatus === 1
                                  ? "outline-primary"
                                  : "outline-danger"
                              }
                              size="sm"
                              className="mr-2 mx-1"
                              onClick={() =>
                                updateUserStatus(
                                  user.userId,
                                  user.branchCode,
                                  user.userStatus === 1 ? 0 : 1
                                )
                              }
                            >
                              <FontAwesomeIcon
                                icon={
                                  user.userStatus === 1
                                    ? faUserAlt
                                    : faUserAltSlash // User is inactive
                                  // User is active
                                }
                              />{" "}
                              {user.userStatus === 1 ? "Active" : "Inactive"}
                            </Button>
                          )}
                        </TableCell>
                      </StyledTableRow>
                    ))}
                  </tbody>
                </Table>
              </TableContainer>
              <div
                className="mt-2"
                style={{ display: "flex", justifyContent: "flex-start" }}
              >
                <Stack spacing={2} direction="row" justifyContent="center">
                  <span className="mt-1">Page No</span>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    variant="outlined"
                    shape="rounded"
                  />
                </Stack>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default UserMaintenance;
