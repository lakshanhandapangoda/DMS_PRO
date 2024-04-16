import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faSave,
  faPlus,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import baseURL from "../Auth/apiConfig";

function ItemRequest() {
  const [items, setItems] = useState([]);
  const [productId, setProductId] = useState("");
  const [requestDate, setRequestDate] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [productList, setProductList] = useState([]);
  const [showAlert, setShowAlert] = useState({ type: "", message: "" });

  useEffect(() => {
    const storedUserName = localStorage.getItem("user_id");
    if (storedUserName) {
      setUserName(storedUserName);
    }

    const fetchProductList = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${baseURL}BranchRequestItems/GetAllActiveProductList`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProductList(response.data);
      } catch (error) {
        if (error.response.status === 401) {
          window.location.href = "/login";
        }
        setShowAlert({
          type: "error",
          message: error.response.data.toString(),
        });
        setTimeout(() => setShowAlert(false), 3000);
        console.error("Error fetching product list:", error);
      }
    };

    fetchProductList();
  }, []);

  const handleAddToCart = () => {
    const currentDate = new Date();
    const selectedProduct = productList.find(
      (product) => product.productId === productId
    );

    if (selectedProduct) {
      const existingItemIndex = items.findIndex(
        (item) => item.productId === selectedProduct.productId
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...items];
        updatedItems[existingItemIndex].quantity =
          parseFloat(updatedItems[existingItemIndex].quantity) +
          parseFloat(quantity);
        setItems(updatedItems);
      } else {
        const newItem = {
          productId: selectedProduct.productId,
          productDescription: selectedProduct.productDescription,
          quantity,
          requestDate: currentDate.toLocaleString(),
          uom: "SNG",
          requestedBy: userName,
        };
        setItems([...items, newItem]);
      }

      setProductId("");
      setQuantity("");
      setRequestDate("");
      setShowAddModal(false);
    } else {
      console.error("Selected product not found in the product list.");
    }
  };

  const handleDeleteItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const handleEditItem = (index) => {
    setEditIndex(index);
  };

  const handleSaveEdit = () => {
    setEditIndex(null);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const branchCode = localStorage.getItem("branchCode");
      const requestData = items.map((item) => ({
        branchCode: branchCode,
        productId: item.productId,
        productDescription: item.productDescription || "",
        uom: item.uom,
        quantity: parseFloat(item.quantity),
        requestBy: "admin",
        requestDate: new Date(item.requestDate).toISOString(),
        requestWorkStation: "::1",
      }));

      const response = await axios.post(
        `${baseURL}BranchRequestItems/PostItemRequest`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowAlert({
        type: "success",
        message: "Request submited successful",
      });
      setTimeout(() => setShowAlert({ type: "", message: "" }), 3000);
      console.log("Request submited successful:", response.data);
      setItems([]);
    } catch (error) {
      if (error.response.status === 401) {
        window.location.href = "/login";
      }

      setShowAlert({
        type: "error",
        message: error.response.data.toString(),
      });
      setTimeout(() => setShowAlert({ type: "", message: "" }), 3000);
      console.error("Error during request:", error);
    }
  };

  return (
    <div className="container">
      {showAlert.type && (
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

      <Button
        variant="primary"
        className="mb-4"
        onClick={() => setShowAddModal(true)}
      >
        Add Item <FontAwesomeIcon icon={faPlus} className="mr-2" />
      </Button>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header>
          <Modal.Title>
            <h5>Add To Cart</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <select
            className="form-control mb-2"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            <option value="">Select Product</option>
            {productList.map((product) => (
              <option key={product.productId} value={product.productId}>
                {product.productId}
              </option>
            ))}
          </select>
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowAddModal(false);
              setProductId("");
              setQuantity("");
            }}
          >
            Close
          </Button>
          <Button variant="success" onClick={handleAddToCart}>
            <FontAwesomeIcon icon={faSave} className="me-2 mx-2" />
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Card className="mb-4">
        <Card.Header as="h6">
          <FontAwesomeIcon icon={faShoppingCart} className="me-2 mx-2" />
          Cart
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
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>UOM</th>
                  <th>Requested By</th>
                  <th>Request Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>
                      {editIndex === index ? (
                        <input
                          type="text"
                          value={item.productId}
                          onChange={(e) =>
                            setItems(
                              items.map((itm, idx) =>
                                idx === index
                                  ? { ...itm, productId: e.target.value }
                                  : itm
                              )
                            )
                          }
                          style={{ maxWidth: "100px" }}
                        />
                      ) : (
                        item.productId
                      )}
                    </td>
                    <td style={{ maxWidth: "200px" }}>
                      {item.productDescription}
                    </td>

                    <td>
                      {editIndex === index ? (
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            setItems(
                              items.map((itm, idx) =>
                                idx === index
                                  ? { ...itm, quantity: e.target.value }
                                  : itm
                              )
                            )
                          }
                          style={{ maxWidth: "100px" }} // Adjust the max-width as needed
                        />
                      ) : (
                        item.quantity
                      )}
                    </td>
                    <td>{item.uom}</td>
                    <td>{item.requestedBy}</td>
                    <td>{item.requestDate}</td>
                    <td>
                      {editIndex === index ? (
                        <Button
                          variant="success"
                          size="sm"
                          className="mr-2 mx-2"
                          onClick={handleSaveEdit}
                        >
                          <FontAwesomeIcon icon={faSave} />
                        </Button>
                      ) : (
                        <Button
                          variant="warning"
                          size="sm"
                          className="mr-2 mx-2"
                          onClick={() => handleEditItem(index)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                      )}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteItem(index)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <Button
            className="mt-4"
            variant="primary"
            onClick={handleSubmit}
            style={{ display: items.length === 0 ? "none" : "block" }}
          >
            Submit
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ItemRequest;
