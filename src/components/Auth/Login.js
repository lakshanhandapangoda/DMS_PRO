import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faBuilding,
  faEyeSlash,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import baseURL from "./apiConfig";
import { withRouter } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

const Login = ({ history }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [branch_name, setBranch_name] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [branches, setBranches] = useState([]);
  const [loginStatus, setLoginStatus] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [show, setShow] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Function to fetch and set the available branches
  const fetchBranches = async () => {
    try {
      const response = await axios.post(
        `${baseURL}Authentication/GetCurrentBranch`,

        {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
        }
      );

      setBranches(response.data["customerCode"]);
      setBranch_name(response.data["custSupName"]);
    } catch (error) {
      console.error("Error occurred while fetching branches:", error);
      setError("Failed to fetch branches");
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else if (field === "newPassword") {
      setShowNewPassword(!showNewPassword);
    } else if (field === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleClose = () => setShow(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const responseIp = await axios.get("https://api64.ipify.org?format=json");
      const clientIp = responseIp.data.ip;
      const ipParts = clientIp.split(".");
      ipParts.pop();

      // const modifiedIp = ipParts.join(".");
      const response = await axios.post(`${baseURL}Authentication/Login`, {
        //  branchIP: modifiedIp,
        branchIP: ":1",
        branchCode: branches,
        userId: username,
        password: password,
      });
      if (response.status === 200) {
        localStorage.setItem("user_id", username);
        localStorage.setItem("branchCode", branches);
        localStorage.setItem("userName", response.data.userName);
        localStorage.setItem("token", response.data.tokenString);
        localStorage.setItem("status", response.data.status);
        setSuccess("Login successful");
        localStorage.setItem("loginStatus", 200);
        history.push("/");
      } else if (response.status === 202) {
        localStorage.setItem("user_id", username);
        localStorage.setItem("branchCode", branches);
        localStorage.setItem("password", password);
        localStorage.setItem("userName", response.data.userName);
        localStorage.setItem("token", response.data.tokenString);
        localStorage.setItem("status", response.data.status);
        setSuccess("Login successful");
        setTimeout(() => {
          setSuccess("");
        }, 3000);

        setShow(true);
      }
    } catch (error) {
      console.log("Error occurred:", error.response.data);
      setError(error.response.data.toString());
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const handleConfirmResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${baseURL}Authentication/PasswordReset`,
        {
          userId: localStorage.getItem("user_id"),
          branchCode: localStorage.getItem("branchCode"),
          password: newPassword,
          oldPassword: localStorage.getItem("password"),
          newPassword: newPassword,
          status: 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage("Password reset successfully."); // Set success message
      handleClose();
    } catch (error) {
      if (error.response.status === 401) {
        window.location.href = "/login";
      }
      setError("An error occurred: " + error.response.data.toString());
      setTimeout(() => setError(null), 3000);

      console.error("An error occurred while processing your request.", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-header">
          <div>
            <img
              src={require("../Auth/logo (2).png")}
              alt="Logo"
              style={{ width: "330px", height: "100px", margin: "auto" }}
            />
          </div>

          <h2 style={{ fontFamily: "Arial, sans-serif", fontWeight: "bold" }}>
            Branch Inventory
          </h2>
          <br />
          <h4 style={{ fontFamily: "Arial, sans-serif", fontStyle: "" }}>
            Management System
          </h4>
          <br />
          <h6 style={{ fontFamily: "Arial, sans-serif", fontSize: "14px" }}>
            Sign In to Continue
          </h6>
        </div>

        <div>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faBuilding} />
                </span>
              </div>
              <TextField
                size="small"
                style={{ width: "268px" }}
                label="Branch"
                variant="outlined"
                id="branch"
                value={branch_name}
                onChange={(e) => setBranchName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faUser} />
                </span>
              </div>
              <TextField
                size="small"
                style={{ width: "268px" }}
                id="username"
                label="Service No"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-prepend">
                <span
                  className="input-group-text"
                  onClick={() => togglePasswordVisibility("password")}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
              </div>
              <TextField
                size="small"
                style={{ width: "268px" }}
                type={showPassword ? "text" : "password"}
                id="password"
                label="Password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ width: "310px" }}
          >
            Sign In
          </Button>
        </form>
        <p className="mt-3 text-center">
          New user?{" "}
          <Link to="/register" style={{ color: "blue" }}>
            Create new account
          </Link>
        </p>
      </div>
      <div>
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
        <div>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header>
              <Modal.Title style={{ fontSize: "18px" }}>
                Reset Your Password
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {error && <div className="alert alert-danger">{error}</div>}
              {successMessage && (
                <div className="alert alert-success">{successMessage}</div>
              )}{" "}
              <form>
                <div className="form-group mb-3">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span
                        className="input-group-text"
                        onClick={() => togglePasswordVisibility("newPassword")}
                      >
                        <FontAwesomeIcon
                          icon={showNewPassword ? faEyeSlash : faEye}
                        />
                      </span>
                    </div>
                    <TextField
                      size="small"
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      label="New Password"
                      variant="outlined"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      sx={{ width: 400 }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span
                        className="input-group-text"
                        onClick={() =>
                          togglePasswordVisibility("confirmPassword")
                        }
                      >
                        <FontAwesomeIcon
                          icon={showConfirmPassword ? faEyeSlash : faEye}
                        />
                      </span>
                    </div>
                    <TextField
                      size="small"
                      type={showConfirmPassword ? "text" : "password"}
                      id="ConfirmPassword"
                      label="Confirm Password"
                      variant="outlined"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      sx={{ width: 400 }}
                    />
                  </div>
                </div>
              </form>
              {/* Render success message */}
            </Modal.Body>
            <Modal.Footer className="justify-content-start">
              <Button variant="contained" onClick={handleConfirmResetPassword}>
                Reset Password
              </Button>
              <Button
                color="warning"
                variant="contained"
                onClick={handleClose}
                className="mx-2"
              >
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Login);
