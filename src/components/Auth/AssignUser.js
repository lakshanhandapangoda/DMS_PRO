import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Form } from "react-bootstrap";
import { Alert } from "react-bootstrap";
import {
  faArrowLeft,
  faArrowRight,
  faSave,
  faTimes,
  faCogs,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import baseURL from "./apiConfig";
import { useLocation } from "react-router-dom";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

const AssignUser = () => {
  const [showAlert, setShowAlert] = useState(false);
  const location = useLocation();
  const { user } = location.state;

  const [availableFunction, setAvailableFunction] = useState([]);
  const [assignedFunction, setAssignedFunction] = useState([]);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const [assignedModules, setAssignedModules] = useState([]);

  useEffect(() => {
    if (user) {
      setUserId(user.userId);
      setUserName(user.userName);
      setUserType(user.userType);

      const fetchAssignedModules = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${baseURL}AppUser/GetAssignedModules/${user.userId}/${user.branchCode}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // setAssignedModules(response.data);
          // console.log('mod',response.data);
          let assignedFunctions = [];
          let i = 0;
          for (const module of response.data) {
            if (i == 0) {
              setSelectedModule(response.data[0].moduleId);
              try {
                const token = localStorage.getItem("token");
                const response1 = await axios.get(
                  `${baseURL}AppUser/GetAppFunctionsByModule/${response.data[0].moduleId}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                setAvailableFunction(response1.data);
              } catch (error) {
                console.error("Error fetching available functions:", error);
              }
            }
            i++;
            const functionResponse = await axios.get(
              `${baseURL}AppUser/GetAssignedFunctions/${user.userId}/${module.moduleId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log("function", functionResponse.data);
            assignedFunctions = [
              ...assignedFunctions,
              ...functionResponse.data,
            ];

            // Assuming assignedFunctions is an array of objects
            assignedFunctions = assignedFunctions.map((func) => ({
              ...func,
              color: "#bbc7be",
            }));
            console.log("function", assignedFunctions);
          }
          setAssignedFunction(assignedFunctions);
        } catch (error) {
          console.error("Error fetching assigned modules:", error);
        }
      };

      fetchAssignedModules();

      const fetchAppModulesForCombo = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${baseURL}AppUser/GetAppModulesForCombo`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setAssignedModules(response.data);
        } catch (error) {
          console.error("Error fetching app modules for combo:", error);
        }
      };

      fetchAppModulesForCombo();
    }
  }, [user]);

  const handleModuleChange = async (event) => {
    const moduleValue = event.target.value;
    setSelectedModule(moduleValue);
    setAvailableFunction([]);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${baseURL}AppUser/GetAppFunctionsByModule/${moduleValue}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAvailableFunction(response.data);
    } catch (error) {
      console.error("Error fetching available functions:", error);
    }
  };

  const handleMoveToAssigned = () => {
    const selectedRoles = availableFunction
      .filter(
        (role) =>
          role.selected &&
          !assignedFunction.some((r) => r.functionId === role.functionId)
      )
      .map((role) => ({
        ...role,
        color: "#7f8082",
      }));

    console.log(selectedRoles.length);
    setAssignedFunction((prevRoles) => [...prevRoles, ...selectedRoles]);
    if (selectedRoles.length > 0) {
      setAvailableFunction((prevRoles) =>
        prevRoles.filter((role) => !role.selected)
      );
    }
  };

  const handleMoveToAvailable = () => {
    const selectedRoles = assignedFunction.filter(
      (role) =>
        role.selected &&
        !availableFunction.some((r) => r.functionId === role.functionId)
    );
    setAvailableFunction((prevRoles) => [...prevRoles, ...selectedRoles]);
    setAssignedFunction((prevRoles) =>
      prevRoles.filter((role) => !role.selected)
    );
  };

  const handleSelectRole = (role, grid) => {
    if (grid === "available") {
      setAvailableFunction((prevRoles) =>
        prevRoles.map((r) =>
          r.functionId === role.functionId ? { ...r, selected: !r.selected } : r
        )
      );
    } else if (grid === "assigned") {
      setAssignedFunction((prevRoles) =>
        prevRoles.map((r) =>
          r.functionId === role.functionId ? { ...r, selected: !r.selected } : r
        )
      );
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const postData = assignedFunction.map((role) => ({
        userId: userId,
        branchCode: user.branchCode,
        appId: 0,
        functionId: role.functionId,
        createdBy: userId,
        moduleId: role.moduleId,
        createdDateTime: new Date().toISOString(),
        createdWorkStation: ":1",
        modifiedBy: userId,
        modifiedDateTime: new Date().toISOString(),
        modifiedWorkStation: ":1",
      }));

      const response = await axios.post(
        `${baseURL}AppUser/PostUserFunctions`,
        postData,
        {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("POST request successful:", response.data);
      setShowAlert({
        type: "success",
        message: "Your request was processed successfully.",
      });
      setTimeout(() => setShowAlert(false), 3000);
      window.location.href = "/user-maintenance";
    } catch (error) {
      if (error.response.status === 401) {
        window.location.href = "/login";
      }
      setShowAlert({
        type: "error",
        message: error.response.data.toString(),
      });

      setTimeout(() => setShowAlert(false), 3000);
      console.error("Error posting user functions:", error);
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleCancel = () => {
    // Reset state values or perform any other cancel actions
    // setUserId("");
    // setUserName("");
    // setUserType("");
    // setSelectedModule("");
    // setAvailableFunction([]);
    setAssignedFunction([]);
  };

  /////////
  return (
    <div>
      <Card className="mb-4">
        {/* <Card.Header
          as="h6"
          className="d-flex justify-content-between align-items-center"
        >
          <div>
            <FontAwesomeIcon icon={faCogs} className="me-2 mx-2" />
            Assign User Function
          </div>
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
          <Form>
            <div className="row mb-4">
              <div className="col-md-4">
                <TextField
                  size="small"
                  fullWidth
                  label="Service No"
                  variant="outlined"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </div>

              <div className="col-md-4">
                <TextField
                  size="small"
                  fullWidth
                  label="User Name"
                  variant="outlined"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </div>

              <div className="col-md-4">
                <FormControl fullWidth>
                  <InputLabel id="module-label">Module</InputLabel>
                  <Select
                    labelId="module-label"
                    value={selectedModule}
                    onChange={handleModuleChange}
                    label="Module"
                    size="small"
                  >
                    {assignedModules.map((module) => (
                      <MenuItem key={module.value} value={module.value}>
                        {module.text}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                {/* <Form.Group className="mb-3" controlId="userType">
                  <Form.Label>User Type</Form.Label>
                  <Form.Control
                    readOnly
                    type="text"
                    placeholder="Enter user type"
                    value={`Grade ${userType} Officer`}
                    onChange={(e) => setUserType(e.target.value)}
                  />
                </Form.Group> */}
              </div>
            </div>
          </Form>

          <div className="row">
            <div className="col-md-6">
              <div
                className="card"
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  border: "2px solid #3477eb",
                  borderRadius: "5px",
                }}
              >
                <div className="card-header bg-primary text-white">
                  Available Function
                </div>
                <div className="card-body">
                  <ul className="list-group">
                    {availableFunction.map((role) => (
                      <li
                        key={role.functionId}
                        className={`list-group-item ${
                          role.selected ? "active" : ""
                        }`}
                        onClick={() => handleSelectRole(role, "available")}
                      >
                        {role.functionName}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div
                className="card"
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  border: "2px solid #95979c",
                  borderRadius: "5px",
                }}
              >
                <div className="card-header bg-secondary text-white">
                  Assigned Function
                </div>
                <div className="card-body">
                  <ul className="list-group">
                    {assignedFunction.map((role) => (
                      <li
                        key={role.functionId}
                        className={`list-group-item ${
                          role.selected ? "active" : ""
                        }`}
                        style={{
                          backgroundColor: role.selected ? "gray" : "inherit",
                        }}
                        onClick={() => handleSelectRole(role, "assigned")}
                      >
                        {role.functionName}
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
            <div className="col-md">
              <div className="d-flex justify-content-start">
                <Button
                  color="primary"
                  variant="contained"
                  className=" mx-2"
                  onClick={handleSubmit}
                >
                  <FontAwesomeIcon icon={faSave} className="me-1 mx-2" />
                  Save
                </Button>
                <Button
                  color="warning"
                  variant="contained"
                  onClick={handleCancel}
                >
                  <FontAwesomeIcon icon={faTimes} className="me-1 mx-2" />
                  Clear
                </Button>

                <Button
                  color="secondary"
                  variant="contained"
                  className=" mx-2"
                  onClick={handleGoBack}
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="me-1 mx-2" />
                  Back
                </Button>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AssignUser;
