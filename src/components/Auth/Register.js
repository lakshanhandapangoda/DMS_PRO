import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faIdBadge,
  faBriefcase,
  faEyeSlash,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import baseURL from "./apiConfig";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Alert, AlertTitle } from "@mui/material";
import { useHistory } from "react-router-dom";

const Register = () => {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [userTypeOptions, setUserTypeOptions] = useState([]);
  const [userType, setUserType] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const history = useHistory();
  const [confirm, setConfirm] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchUserTypeOptions = async () => {
      try {
        const response = await axios.get(
          `${baseURL}Authentication/GetBranchUserTypes`
        );
        setUserTypeOptions(response.data);
      } catch (error) {
        console.error("Error fetching user type options:", error);
      }
    };

    fetchUserTypeOptions();
  }, []);

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else if (field === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const branchCode = localStorage.getItem("branchCode");
      const ipAddress = localStorage.getItem("ipAddress");
      const response = await axios.post(
        `${baseURL}Authentication/PostUser`,
        {
          oUserForRegisterDto: {
            userStatus: 1,
            noOfAttempts: 0,
            emailAddress: "",
            createdBy: username.toString(),
            createdDateTime: new Date().toISOString(),
            createdWorkStation: "",
            modifiedBy: "",
            modifiedDateTime: new Date().toISOString(),
            modifiedWorkStation: "",
          },
          UserId: userId,
          userType: parseFloat(userType),
          Password: password,
          UserName: username,
          BranchCode: branchCode,
        },
        {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
        }
      );

      if (response.status === 201) {
        setSuccess("A new user has been successfully created");
        setTimeout(() => setSuccess(null), 10000);
        setConfirm(true);
      }
    } catch (error) {
      setError(error.response.data.toString());
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const handleLogin = () => {
    history.push("/login");
  };

  return (
    <div className="register-container">
      <div className="register-wrapper">
        <div className="register-header">
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
        </div>
        <div>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faBriefcase} />
                </span>
              </div>

              <FormControl style={{ width: "268px" }}>
                <InputLabel id="module-label">UserType</InputLabel>
                <Select
                  id="userType"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  label="User Type"
                  size="small"
                  required
                >
                  {userTypeOptions.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.text}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* <select
                id="userType"
                className="form-control"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                required
                placeholder=""
              >
                <option value="">Select User Type</option>
                {userTypeOptions.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.text}
                  </option>
                ))}
              </select> */}
            </div>
          </div>
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faIdBadge} />
                </span>
              </div>
              <TextField
                size="small"
                style={{ width: "270px" }}
                label="Service No"
                variant="outlined"
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
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
                style={{ width: "270px" }}
                id="username"
                label="User Name"
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
                style={{ width: "266px" }}
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
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-prepend">
                <span
                  className="input-group-text"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                >
                  <FontAwesomeIcon
                    icon={showConfirmPassword ? faEyeSlash : faEye}
                  />
                </span>
              </div>
              <TextField
                size="small"
                style={{ width: "266px" }}
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                label="Confirm Password"
                variant="outlined"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            Sign Up
          </Button>
        </form>
        <p className="mt-3 text-center">
          Already have an account?{" "}
          <Link to="/login" style={{ color: "blue" }}>
            Sign in
          </Link>
        </p>
      </div>
      <Dialog open={confirm} onClose={() => setConfirm(false)}>
        <DialogContent>
          <Alert severity="success">
            <AlertTitle>Success</AlertTitle>
            ID <strong>{userId}</strong>. Call manager to activate
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogin}>OK</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Register;
