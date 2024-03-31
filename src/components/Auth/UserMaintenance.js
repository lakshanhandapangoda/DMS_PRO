import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import {
  faEye,
  faPlus,
  faLock,
  faUserAltSlash,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function UserMaintenance() {
  // Sample data array
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const users = [
    { id: 1111, name: "Mark", designation: "CEO", status: "Active" },
    { id: 2222, name: "John", designation: "Manager", status: "Inactive" },
    // Add more user objects as needed
  ];

  // Function to handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    // Filter users based on search query
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
        user.designation
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        user.status.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  return (
    <div>
      <div>
        <div className="flex-fill ml-3 mx-4">
          <Card>
            <Card.Header as="h6">Pending Delivery</Card.Header>
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
                    <th>Designation</th>
                    <th>Status</th>
                    <th>Assign Function</th>
                    <th>Reset Password</th>
                    <th>Active/Inactive</th>
                  </tr>
                </thead>
                <tbody>
                  {(searchQuery ? filteredUsers : users).map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.designation}</td>
                      <td>{user.status}</td>
                      <td>
                        <Link to="/assign-user">
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
                        >
                          <FontAwesomeIcon icon={faUserAltSlash} /> Active
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
