import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal"; // Import modal component
import baseURL from "./apiConfig";
import Card from "react-bootstrap/Card";
import { useHistory } from "react-router-dom";
import {
  faUser,
  faPlus,
  faLock,
  faUserAltSlash,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Pagination from "react-bootstrap/Pagination";

function UserMaintenance() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [itemsPerPage] = useState(6);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Define fetchUsers outside useEffect
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
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter users based on search query
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

      // Call fetchUsers
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

  const handleResetPassword = (user) => {
    setSelectedUser(user);
    setShowResetModal(true);
  };

  const handleCloseResetModal = () => {
    setShowResetModal(false);
    setOldPassword("");
    setNewPassword("");
  };

  const handleConfirmResetPassword = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${baseURL}Authentication/PasswordReset`,
        {
          userId: selectedUser.userId,
          branchCode: selectedUser.branchCode,
          password: oldPassword,
          oldPassword: oldPassword,
          newPassword: newPassword,
          status: selectedUser.userStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      handleCloseResetModal();
      fetchUsers();
      console.log("Reset password for user successfully.");
      setShowAlert({
        type: "success",
        message: "Reset password for user successfully.",
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
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const visibleUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div>
      <div>
        <div className="flex-fill ml-3 mx-4">
          <Card>
            <Card.Header as="h6">
              <FontAwesomeIcon icon={faUser} className="me-2 mx-2" />
              User Maintenance
            </Card.Header>

            {/* Display the alert when showAlert is true */}
            {showAlert && (
              <div
                style={{
                  position: "fixed",
                  top: "55px",
                  right: "40px",
                  transform: "translateY(-50%)",
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
              <Table striped bordered hover className="text-center">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>User Name</th>

                    <th>Function</th>
                    <th>Password</th>
                    <th>Current Satus</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleUsers.map((user, index) => (
                    <tr key={index}>
                      <td>{user.userId}</td>
                      <td>{user.userName}</td>

                      <td>
                        <Link
                          to={{
                            pathname: `/assign-user/${user.userId}`,
                            state: { user: user },
                          }}
                        >
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="mr-2 mx-2"
                          >
                            <FontAwesomeIcon icon={faPlus} /> Assign
                          </Button>
                        </Link>
                      </td>
                      <td>
                        <Button
                          variant="outline-warning"
                          size="sm"
                          className="mr-2 mx-2"
                          onClick={() => handleResetPassword(user)}
                        >
                          <FontAwesomeIcon icon={faLock} /> Reset
                        </Button>
                      </td>

                      <td>
                        <Button
                          variant={
                            user.userStatus === 1
                              ? "outline-primary"
                              : "outline-danger"
                          }
                          size="sm"
                          className="mr-2 mx-2"
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
                              user.userStatus === 0
                                ? faUserAltSlash // User is inactive
                                : faUserAlt // User is active
                            }
                          />{" "}
                          {user.userStatus === 0 ? "Inactive" : "Active"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div>
                {/* Your existing JSX code */}
                <Pagination>
                  <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                  {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentPage}
                      onClick={() => handlePageChange(index + 1)}
                      activeLabel=""
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={indexOfLastItem >= filteredUsers.length}
                  />
                </Pagination>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Reset Password Modal */}
      <Modal show={showResetModal} onHide={handleCloseResetModal}>
        <Modal.Header>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="oldPassword" className="form-label">
                Old Password
              </label>
              <input
                type="password"
                className="form-control"
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">
                New Password
              </label>
              <input
                type="password"
                className="form-control"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseResetModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmResetPassword}>
            Reset Password
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserMaintenance;
