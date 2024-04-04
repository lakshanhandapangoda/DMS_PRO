import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const branch = localStorage.getItem("branchCode");
        const response = await axios.get(
          `${baseURL}AppUser/GetUsers/${branch}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

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

  // Function to update user status
  const updateUserStatus = async (userId, branchCode, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${baseURL}AppUser/PasswordRest`,
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
      // Assuming the user status is updated successfully, you may want to fetch the updated users again
      fetchUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
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
                        >
                          <FontAwesomeIcon icon={faLock} /> Reset
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
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
    </div>
  );
}

export default UserMaintenance;
