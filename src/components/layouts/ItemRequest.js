import React, { useState } from "react";
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

function ItemRequest() {
  const [items, setItems] = useState([]);
  const [productId, setProductId] = useState("");
  const [requestDate, setRequestDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddToCart = () => {
    const currentDate = new Date();
    const newItem = {
      productId,
      quantity,
      requestDate: currentDate.toLocaleString(),
    };
    setItems([...items, newItem]);
    setProductId("");
    setQuantity("");
    setRequestDate("");
    setShowAddModal(false); // Close the modal after adding to cart
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

  return (
    <div className="container">
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
            <h5>Add TO Cart</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Product ID"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          />
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddToCart}>
            Save to Cart
          </Button>
        </Modal.Footer>
      </Modal>

      <Card className="mb-4">
        <Card.Header as="h6">
          <FontAwesomeIcon icon={faShoppingCart} className="me-2 mx-2" />
          Cart
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
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
                    <td>Description</td>
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

                    <td>UOM</td>
                    <td>Requested By</td>
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
        </Card.Body>
      </Card>
    </div>
  );
}

export default ItemRequest;
