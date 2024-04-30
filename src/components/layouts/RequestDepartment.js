import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Card from "react-bootstrap/Card";
import {
  faEye,
  faClock,
  faShoppingCart,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import baseURL from "../Auth/apiConfig";
import axios from "axios";

function RequestApproval() {
  const [unauthorizedProducts, setUnauthorizedProducts] = useState([]);
  const [pendingDeliveries, setPendingDeliveries] = useState([]);
  const [deliveryTypes, setDeliveryTypes] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedDeliveryType, setSelectedDeliveryType] = useState("");
  const [showAlert, setShowAlert] = useState({ type: "", message: "" });

  useEffect(() => {
    const fetchUnauthorizedProducts = async () => {
      try {
        const branchCode = localStorage.getItem("branchCode");
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${baseURL}BranchRequestItems/GetUnAuthorizedCartProductDetails/2/${branchCode}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUnauthorizedProducts(response.data);
      } catch (error) {
        if (error.response.status === 401) {
          window.location.href = "/login";
        }
        setShowAlert({
          type: "error",
          message: error.response.data.toString(),
        });
        setTimeout(() => setShowAlert({ type: "", message: "" }), 3000);
        console.error("Error fetching unauthorized products:", error);
      }
    };

    const fetchPendingDeliveries = async () => {
      try {
        const branchCode = localStorage.getItem("branchCode");
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${baseURL}BranchRequestItems/GetPendingDeliveryList/2/${branchCode}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPendingDeliveries(response.data);
      } catch (error) {
        console.error("Error fetching pending deliveries:", error);
      }
    };

    const fetchDeliveryTypes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${baseURL}BranchRequestItems/GetDeliveryTypeByDecodes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDeliveryTypes(response.data);
      } catch (error) {
        if (error.response.status === 401) {
          window.location.href = "/login";
        }
        console.error("Error fetching delivery types:", error);
      }
    };
    fetchPendingDeliveries();
    fetchUnauthorizedProducts();
    fetchDeliveryTypes();
  }, []);

  return (
    <div>
      {showAlert.type && (
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
              onClick={() => setShowAlert({ type: "", message: "" })}
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
      <div className="d-flex justify-content-between mb-4">
        <Link to="/item-request">
          <Button color="secondary" variant="contained" className="mx-1">
            <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
            Add To Cart
          </Button>
        </Link>
      </div>
      <div className="d-flex">
        <Card className="flex-fill mr-2 ml-1" style={{ overflow: "auto" }}>
          <Card.Header as="h6">
            <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
            <FontAwesomeIcon
              icon={faExclamationCircle}
              className="text-danger me-2 mx-2"
            />
            Unauthorized Cart
          </Card.Header>
          <Card.Body>
            <TableContainer sx={{ maxHeight: "400px", overflow: "auto" }}>
              <Table stickyHeader aria-label="sticky table" size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        backgroundColor: "#3d3d3d",
                        color: "white",
                      }}
                      align="left"
                    >
                      Product ID
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        backgroundColor: "#3d3d3d",
                        color: "white",
                      }}
                      align="left"
                    >
                      Product Name
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        backgroundColor: "#3d3d3d",
                        color: "white",
                      }}
                      align="left"
                    >
                      UOM
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        backgroundColor: "#3d3d3d",
                        color: "white",
                      }}
                      align="left"
                    >
                      Quantity
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {unauthorizedProducts.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell align="left">{product.productId}</TableCell>
                      <TableCell align="left" style={{ maxWidth: "170px" }}>
                        {product.productDescription}
                      </TableCell>
                      <TableCell align="left">
                        {product.txUnitOfMeasure}
                      </TableCell>
                      <TableCell align="center">{product.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card.Body>
        </Card>

        {/* Pending Delivery Card */}
        <div>
          <Card className="flex-fill mx-3" style={{ maxWidth: "500px" }}>
            <Card.Header as="h6">
              <FontAwesomeIcon icon={faClock} className="me-2 mx-2" />
              Pending Delivery
            </Card.Header>
            <Card.Body>
              <TableContainer style={{ maxHeight: "400px", overflowY: "auto" }}>
                <Table stickyHeader aria-label="sticky table" size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        style={{
                          fontWeight: "bold",
                          backgroundColor: "#3d3d3d",
                          color: "white",
                        }}
                        align="left"
                      >
                        Ref No
                      </TableCell>
                      <TableCell
                        style={{
                          fontWeight: "bold",
                          backgroundColor: "#3d3d3d",
                          color: "white",
                        }}
                        align="left"
                      >
                        Date
                      </TableCell>
                      <TableCell
                        style={{
                          fontWeight: "bold",
                          backgroundColor: "#3d3d3d",
                          color: "white",
                        }}
                        align="left"
                      >
                        Delivery
                      </TableCell>
                      <TableCell
                        style={{
                          fontWeight: "bold",
                          backgroundColor: "#3d3d3d",
                          color: "white",
                        }}
                        align="center"
                      >
                        View
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingDeliveries.map((delivery, index) => (
                      <TableRow key={index}>
                        <TableCell>{delivery.refNo}</TableCell>
                        <TableCell
                          style={{
                            maxWidth: "120px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          <div>
                            {new Date(delivery.date).toLocaleDateString()}
                          </div>
                          <div>
                            {new Date(delivery.date).toLocaleTimeString()}
                          </div>
                        </TableCell>

                        <TableCell>{delivery.deliveyTypeText}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            className="mx-2"
                            component={Link}
                            to={`/view-request/${delivery.refNo}`}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default RequestApproval;
