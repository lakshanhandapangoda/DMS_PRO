import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "react-bootstrap/Button";
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

  return (
    <div>
      <div className="d-flex justify-content-between mb-4">
        <Link to="/ItemRequestPage">
          <Button variant="outline-primary mx-4">
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
              <div
                className="table-responsive"
                style={{ maxHeight: "400px", overflowY: "auto" }}
              >
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Product ID</th>
                      <th>Product Name</th>
                      <th>UOM</th>
                      <th>Quantity</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unauthorizedProducts.map((product, index) => (
                      <tr key={index}>
                        <td>{product.productId}</td>
                        <td style={{ maxWidth: "150px" }}>
                          {product.productDescription}
                        </td>
                        <td>{product.txUnitOfMeasure}</td>
                        <td>{product.quantity}</td>
                        <td>
                          <Form.Check inline name="group1" className="mx-4" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <Form.Select aria-label="Default select example" className="mt-4">
                <option>Select delivery type</option>
                {deliveryTypes.map((type, index) => (
                  <option key={index} value={type.deliveryTypeValue}>
                    {type.deliveryTypeText}
                  </option>
                ))}
              </Form.Select>

              <div className="mt-4">
                <Button variant="outline-primary " className="mr-3">
                  Send Request
                </Button>
                <Button variant="outline-warning mx-2" className="mr-3  mx-2">
                  Clear
                </Button>
                <Button variant="outline-success" className="mr-3">
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
              <div
                className="table-responsive"
                style={{ maxHeight: "400px", overflowY: "auto" }}
              >
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Ref No</th>
                      <th>Date</th>
                      <th>Delivery</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingDeliveries.map((delivery, index) => (
                      <tr key={index}>
                        <td>{delivery.refNo}</td>
                        <td>{delivery.date}</td>
                        <td>{delivery.deliveyTypeText}</td>
                        <td>
                          <Button
                            variant="primary"
                            size="sm"
                            className="mr-2 mx-2"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default RequestApproval;
