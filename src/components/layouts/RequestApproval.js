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
        console.error("Error fetching delivery types:", error);
      }
    };
    fetchPendingDeliveries();
    fetchUnauthorizedProducts();
    fetchDeliveryTypes();
  }, []);

  const handleProductSelectionChange = (e, productId) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    }
  };

  const handleDeliveryTypeChange = (e) => {
    setSelectedDeliveryType(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const branchCode = localStorage.getItem("branchCode");
      const token = localStorage.getItem("token");
      const user_id = localStorage.getItem("user_id");

      const payload = unauthorizedProducts.map((product) => ({
        branchFlag: 2,
        branchCode: branchCode,
        productId: product.productId,
        productDescription: product.productDescription,
        txUnitOfMeasure: product.txUnitOfMeasure,
        quantity: product.quantity,
        deliveryType: selectedDeliveryType,
        createdBy: user_id,
        authorizedBy: user_id,
        createdWorkStation: "::1",
        modifiedBy: user_id,
        modifiedWorkStation: "::1",
      }));

      // Send POST request
      const response = await axios.post(
        `${baseURL}BranchRequestItems/PostRequestApproval`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Post request sent successfully:", response.data);

      setSelectedProducts([]);
      setSelectedDeliveryType("");
    } catch (error) {
      console.error("Error sending post request:", error);
    }
  };

  const handleClear = () => {
    setSelectedProducts([]);
    setSelectedDeliveryType("");
  };

  const handleExit = () => {
    // Handle exit logic here
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-4">
        <Link to="/ItemRequestPage">
          <Button color="primary" variant="contained" className="mx-4">
            <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
            Add To Cart
          </Button>
        </Link>
      </div>
      <div className="d-flex">
        <div className="flex-fill mr-3 mx-4">
          <Card>
            <Card.Header as="h6">
              <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
              <FontAwesomeIcon
                icon={faExclamationCircle}
                className="text-danger me-2 mx-2"
              />
              Unauthorized Cart
            </Card.Header>
            <Card.Body>
              <TableContainer sx={{ maxHeight: "400px", overflowY: "auto" }}>
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
                      <TableCell
                        style={{
                          fontWeight: "bold",
                          backgroundColor: "#3d3d3d",
                          color: "white",
                        }}
                        align="left"
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {unauthorizedProducts.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell align="left">{product.productId}</TableCell>
                        <TableCell align="left" style={{ maxWidth: "150px" }}>
                          {product.productDescription}
                        </TableCell>
                        <TableCell align="left">
                          {product.txUnitOfMeasure}
                        </TableCell>
                        <TableCell align="left">{product.quantity}</TableCell>
                        <TableCell>
                          <Checkbox
                            name="group1"
                            className="mx-4"
                            onChange={(e) =>
                              handleProductSelectionChange(e, product.productId)
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* <Form.Select
                aria-label="Default select example"
                className="mt-4"
                onChange={handleDeliveryTypeChange}
                value={selectedDeliveryType}
              >
                <option>Select delivery type</option>
                {deliveryTypes.map((type, index) => (
                  <option key={index} value={type.deliveryTypeValue}>
                    {type.deliveryTypeText}
                  </option>
                ))}
              </Form.Select> */}

              <FormControl className="mt-4" sx={{ width: "250px" }}>
                <InputLabel id="delivery-type-label">
                  Select delivery type
                </InputLabel>
                <Select
                  size="small"
                  labelId="delivery-type-label"
                  value={selectedDeliveryType}
                  onChange={handleDeliveryTypeChange}
                  label="Select delivery type"
                >
                  <MenuItem value="">Select delivery type</MenuItem>
                  {deliveryTypes.map((type, index) => (
                    <MenuItem key={index} value={type.deliveryTypeValue}>
                      {type.deliveryTypeText}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <div className="mt-4">
                <Button
                  color="success"
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!selectedProducts.length || !selectedDeliveryType}
                >
                  Send Request
                </Button>
                <Button
                  color="warning"
                  variant="contained"
                  onClick={handleClear}
                  className="mr-3  mx-2"
                >
                  Clear
                </Button>
                <Button
                  color="success"
                  variant="contained"
                  onClick={handleExit}
                  className="mr-3"
                >
                  Exit
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
        {/* Pending Delivery Card */}
        <div className="flex-fill ml-3 mx-4">
          <Card>
            <Card.Header as="h6">
              <FontAwesomeIcon icon={faClock} className="me-2 mx-2" />
              Pending Delivery
            </Card.Header>
            <Card.Body>
              <TableContainer
                className="table-responsive"
                style={{ maxHeight: "400px", overflowY: "auto" }}
              >
                <Table striped bordered hover>
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
                        align="left"
                      >
                        View
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingDeliveries.map((delivery, index) => (
                      <TableRow key={index}>
                        <TableCell>{delivery.refNo}</TableCell>
                        <TableCell>{delivery.date}</TableCell>
                        <TableCell>{delivery.deliveyTypeText}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            className="mr-2 mx-2"
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
