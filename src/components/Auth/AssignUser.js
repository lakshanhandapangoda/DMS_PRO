
import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { faArrowLeft ,  faArrowRight ,faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const AssignUser = () => {
  const [availableRoles, setAvailableRoles] = useState([
    { id: 1, name: "Admin1" },
    { id: 2, name: "Manager1" },
    { id: 3, name: "Employee1" },
    { id: 4, name: "Guest1" },
    { id: 5, name: "Admin" },
    { id: 6, name: "Manager" },
    { id: 7, name: "Employee" },
    { id: 8, name: "Guest" },
  ]);
  const [assignedRoles, setAssignedRoles] = useState([]);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");
  const [selectedModule, setSelectedModule] = useState("");

  const handleRoleSelect = (role) => {
    setAvailableRoles((prevRoles) =>
      prevRoles.filter((r) => r.id !== role.id)
    );
    setAssignedRoles((prevRoles) => [...prevRoles, role]);
  };

  const handleRoleRemove = (role) => {
    setAssignedRoles((prevRoles) =>
      prevRoles.filter((r) => r.id !== role.id)
    );
    setAvailableRoles((prevRoles) => [...prevRoles, role]);
  };

  const handleMoveToAssigned = () => {
    // Move selected roles to assigned roles
    const selectedRoles = availableRoles.filter((role) => role.selected);
    setAssignedRoles((prevRoles) => [...prevRoles, ...selectedRoles]);
    setAvailableRoles((prevRoles) =>
      prevRoles.filter((role) => !role.selected)
    );
  };

  const handleMoveToAvailable = () => {
    // Move selected roles to available roles
    const selectedRoles = assignedRoles.filter((role) => role.selected);
    setAvailableRoles((prevRoles) => [...prevRoles, ...selectedRoles]);
    setAssignedRoles((prevRoles) =>
      prevRoles.filter((role) => !role.selected)
    );
  };

  const handleSelectRole = (role, grid) => {
    if (grid === "available") {
      setAvailableRoles((prevRoles) =>
        prevRoles.map((r) =>
          r.id === role.id ? { ...r, selected: !r.selected } : r
        )
      );
    } else if (grid === "assigned") {
      setAssignedRoles((prevRoles) =>
        prevRoles.map((r) =>
          r.id === role.id ? { ...r, selected: !r.selected } : r
        )
      );
    }
  };

  const handleModuleChange = (e) => {
    setSelectedModule(e.target.value);
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  return (
    <div className="container">
      <Card className="mb-4">
        <Card.Header as="h6">Assign User Roles</Card.Header>
        <Card.Body>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="userId">
                  <Form.Label>User ID</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter user ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="userName">
                  <Form.Label>User Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter user name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>
  
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="userType">
                  <Form.Label>User Type</Form.Label>
                  <Form.Control
                    as="select"
                    value={userType}
                    onChange={handleUserTypeChange}
                  >
                    <option value="">Select user type</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="employee">Employee</option>
                    <option value="guest">Guest</option>
                  </Form.Control>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="module">
                  <Form.Label>Module</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedModule}
                    onChange={handleModuleChange}
                  >
                    <option value="">Select module</option>
                    {/* Add your module options here */}
                  </Form.Control>
                </Form.Group>
              </div>
            </div>
          </Form>
  
          <div className="row">
            <div className="col-md-6">
              <div className="card" style={{ maxHeight: "300px", overflowY: "auto" }}>
                <div className="card-header bg-primary text-white">
                  Available Function
                </div>
                <div className="card-body">
                  <ul className="list-group">
                    {availableRoles.map((role) => (
                      <li
                        key={role.id}
                        className={`list-group-item ${
                          role.selected ? "active" : ""
                        }`}
                        onClick={() => handleSelectRole(role, "available")}
                      >
                        {role.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card" style={{ maxHeight: "300px", overflowY: "auto" }}>
                <div className="card-header bg-secondary text-white">
                  Assigned Function
                </div>
                <div className="card-body">
                  <ul className="list-group">
                    {assignedRoles.map((role) => (
                      <li
                        key={role.id}
                        className={`list-group-item ${
                          role.selected ? "active" : ""
                        }`}
                        onClick={() => handleSelectRole(role, "assigned")}
                      >
                        {role.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
  
          <div className="row mt-4">
            <div className="col-md-6 d-flex justify-content-end">
              <button
                className="btn btn-primary"
                onClick={handleMoveToAssigned}
              >
                 <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
            <div className="col-md-6">
              <button
                className="btn btn-secondary float-end"
                onClick={handleMoveToAvailable}
              >
             <FontAwesomeIcon icon={faArrowLeft} />    
              </button>
            </div>
          </div>
  
          <div className="row mt-4">
          <div className="col-md-6">
    <div className="d-flex justify-content-start">
      {/* Save button */}
      <button className="btn btn-success me-2 mx-2">
        <FontAwesomeIcon icon={faSave} className="me-1 mx-2" />
        Save
      </button>
      {/* Cancel button */}
      <button className="btn btn-danger">
        <FontAwesomeIcon icon={faTimes} className="me-1 mx-2" />
        Cancel
      </button>
    </div>
  </div>
</div>

  
        </Card.Body>
      </Card>
    </div>
  );
  
  
                    };
                    export default AssignUser;
  
