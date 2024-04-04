import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import {
  faEdit,
  faTrash,
  faEye,
  faCartPlus,
  faShoppingCart,
  faExclamationCircle,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function RequestDepartment() {
  // Define state for your data arrays
  const [unauthorizedData, setUnauthorizedData] = useState([
    { productId: "1", productName: "Product 1", uom: "Unit", quantity: 5 },
    { productId: "2", productName: "Product 2", uom: "Unit", quantity: 10 },
    { productId: "3", productName: "Product 3", uom: "Unit", quantity: 8 },
  ]);

  const [editIndex, setEditIndex] = useState(null);
  const [editedItem, setEditedItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedItem({ ...unauthorizedData[index] });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (editedItem) {
      const updatedData = [...unauthorizedData];
      updatedData[editIndex] = editedItem;
      setUnauthorizedData(updatedData);
      setShowEditModal(false);
    }
  };

  const handleChange = (e, field) => {
    setEditedItem({ ...editedItem, [field]: e.target.value });
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditIndex(null);
    setEditedItem(null);
  };

  const handleDelete = (index) => {
    const newData = [...unauthorizedData];
    newData.splice(index, 1);
    setUnauthorizedData(newData);
  };

  const [pendingDeliveryData] = useState([
    { refNo: "A123", date: "2024-03-21", delivery: "Delivery 1" },
    { refNo: "B456", date: "2024-03-22", delivery: "Delivery 2" },
    { refNo: "C789", date: "2024-03-23", delivery: "Delivery 3" },
  ]);

  return (
    <div>
      <div className="d-flex justify-content-between mb-4">
        <Link to="/ItemRequestPage">
          <Button variant="outline-primary mx-4">
            <FontAwesomeIcon icon={faCartPlus} className="mr-2" />
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
                  {unauthorizedData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.productId}</td>
                      <td>{item.productName}</td>
                      <td>{item.uom}</td>
                      <td>{item.quantity}</td>
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          className="mr-2 mx-2"
                          onClick={() => handleEdit(index)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(index)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </div>
        <div className="flex-fill ml-3 mx-4">
          <Card>
            <Card.Header as="h6">
              <FontAwesomeIcon icon={faClock} className="me-2 mx-2" />
              Pending Delivery
            </Card.Header>
            <Card.Body>
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
                  {pendingDeliveryData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.refNo}</td>
                      <td>{item.date}</td>
                      <td>{item.delivery}</td>
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
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header>
          <Modal.Title>
            <h5>Edit Item</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="productId">
            <Form.Label>Product ID</Form.Label>
            <Form.Control
              type="text"
              value={editedItem ? editedItem.productId : ""}
              onChange={(e) => handleChange(e, "productId")}
            />
          </Form.Group>
          <Form.Group controlId="productName">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              value={editedItem ? editedItem.productName : ""}
              onChange={(e) => handleChange(e, "productName")}
            />
          </Form.Group>
          <Form.Group controlId="uom">
            <Form.Label>UOM</Form.Label>
            <Form.Control
              type="text"
              value={editedItem ? editedItem.uom : ""}
              onChange={(e) => handleChange(e, "uom")}
            />
          </Form.Group>
          <Form.Group controlId="quantity">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="text"
              value={editedItem ? editedItem.quantity : ""}
              onChange={(e) => handleChange(e, "quantity")}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default RequestDepartment;
