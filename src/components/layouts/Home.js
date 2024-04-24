import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import baseURL from "../Auth/apiConfig";
import { Alert } from "react-bootstrap";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Home = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleConfirmResetPassword = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${baseURL}Authentication/PasswordReset`,
        {
          userId: localStorage.getItem("user_id"),
          branchCode: localStorage.getItem("branchCode"),
          password: oldPassword,
          oldPassword: oldPassword,
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

  useEffect(() => {
    const loginStatusFromLocalStorage = localStorage.getItem("loginStatus");
    if (loginStatusFromLocalStorage === "202") {
      setShow(true);
    }
  }, []);

  return (
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
            <Modal.Title>Reset Your Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faLock} />
                    </span>
                  </div>
                  <input
                    type="password"
                    id="oldPassword"
                    className="form-control"
                    placeholder=""
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                  <label for="branch" class="input-label">
                    Password
                  </label>
                </div>
              </div>

              <div className="form-group mb-3">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faLock} />
                    </span>
                  </div>
                  <input
                    type="password"
                    id="oldPassword"
                    className="form-control"
                    placeholder=""
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <label for="branch" class="input-label">
                    New Password
                  </label>
                </div>
              </div>
            </form>
            {error && <div className="alert alert-danger">{error}</div>}
            {successMessage && (
              <div className="alert alert-success">{successMessage}</div>
            )}{" "}
            {/* Render success message */}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmResetPassword}>
              Reset Password
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Home;
