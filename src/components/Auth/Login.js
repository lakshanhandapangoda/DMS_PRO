import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faBuilding } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import baseURL from "./apiConfig";
import { withRouter } from "react-router-dom";
const Login = ({ history }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [branches, setBranches] = useState([]);

  // Function to fetch and set the available branches
  const fetchBranches = async () => {
    try {
      const response = await axios.post(
        `${baseURL}Authentication/GetCurrentBranch`,
        "::1",
        {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
        }
      );

      console.log(response.data["customerCode"]);
      setBranches(response.data["customerCode"]);
    } catch (error) {
      console.error("Error occurred while fetching branches:", error);
      setError("Failed to fetch branches");
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const responseIp = await axios.get("https://api64.ipify.org?format=json");
      const clientIp = responseIp.data.ip;
      console.log("ip", clientIp);
      const response = await axios.post(`${baseURL}Authentication/Login`, {
        branchIP: ":1",
        branchCode: branches,
        userId: username,
        password: password,
      });
      if (response.status === 200) {
        setSuccess("Login successful");
        history.push("/");
      } else {
        setError("Login failed");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setError("An error occurred while attempting to login");
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
            Sign In to Start Your Session
          </h6>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faBuilding} />
                </span>
              </div>
              <input
                type="text"
                id="branch"
                className="form-control"
                placeholder="Username"
                value={branches}
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
          <button type="submit" className="btn btn-primary btn-block">
            Sign In
          </button>
        </form>
        <p className="mt-3 text-center">
          New user?{" "}
          <Link to="/register" style={{ color: "blue" }}>
            Create new account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default withRouter(Login);
