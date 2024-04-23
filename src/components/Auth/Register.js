import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faIdBadge,
  faBriefcase,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import baseURL from "./apiConfig";

const Register = () => {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [userTypeOptions, setUserTypeOptions] = useState([]);
  const [userType, setUserType] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
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
          BranchCode: "0001010",
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
      }
    } catch (error) {
      setError(error.response.data.toString());
      setTimeout(() => {
        setError("");
      }, 3000);
    }
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
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faBriefcase} />
                </span>
              </div>
              <select
                id="userType"
                className="form-control"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                required
              >
                <option value="">Select User Type</option>
                {userTypeOptions.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.text}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faIdBadge} />
                </span>
              </div>
              <input
                type="text"
                id="userId"
                className="form-control"
                placeholder="User ID"
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
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faLock} />
                </span>
              </div>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faLock} />
                </span>
              </div>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Sign Up
          </button>
        </form>
        <p className="mt-3 text-center">
          Already have an account?{" "}
          <Link to="/login" style={{ color: "blue" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
