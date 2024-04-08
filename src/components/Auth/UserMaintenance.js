import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal"; // Import modal component
import baseURL from "./apiConfig";
import Card from "react-bootstrap/Card";
import {
  faUser,
  faPlus,
  faLock,
  faUserAltSlash,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function UserMaintenance() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  // Define fetchUsers outside useEffect
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const branch = localStorage.getItem("branchCode");
      if (!token) {
        window.location.href = "/login";
        return;
      }
      const response = await axios.get(`${baseURL}AppUser/GetUsers/${branch}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
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

  const updateUserStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${baseURL}AppUser/UpdateUserStatus`,
        {
          userId: userId,
          branchCode: branchCode,
          userStatus: newStatus,
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
      setShowAlert({
        type: "error",
        message: "An error occurred while processing your request.",
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
      setShowAlert({
        type: "error",
        message: "An error occurred while processing your request.",
      });
      setTimeout(() => setShowAlert(false), 3000);
      console.error("An error occurred while processing your request.", error);
    }
  };

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
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>User Name</th>
                    <th>Branch Code</th>
                    <th>User Type</th>
                    <th>User Status</th>
                    <th>Assign Function</th>
                    <th>Reset Password</th>
                    <th>Active/Inactive</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={index}>
                      <td>{user.userId}</td>
                      <td>{user.userName}</td>
                      <td>{user.branchCode}</td>
                      <td>Grade{user.userType}Oficer</td>
                      <td>{user.userStatus === 1 ? "Active" : "Inactive"}</td>

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
                          <FontAwesomeIcon icon={faUserAltSlash} />{" "}
                          {user.userStatus === 1 ? "Inactive" : "Active"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
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
