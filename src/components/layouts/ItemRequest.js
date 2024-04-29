import React, { useState, useEffect, ChangeEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faSave,
  faPlus,
  faTimes,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import Card from "react-bootstrap/Card";
import { styled } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import baseURL from "../Auth/apiConfig";
import {
  TextField,
  FormControl,
  InputLabel,
  Autocomplete,
  Button,
} from "@mui/material";

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

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

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
        requestBy: localStorage.getItem("user_id"),
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

  const handleProductChange = (newValue) => {
    if (newValue) {
      setProductDescription(newValue.productDescription);
      setProductId(newValue.productId);
    } else {
      setProductDescription("");
      setProductId("");
    }
  };

  return (
    <div className="container">
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

      <Button
        color="secondary"
        variant="contained"
        className=" mb-4"
        onClick={() => setShowAddModal(true)}
      >
        Add Item <FontAwesomeIcon icon={faPlus} className="mx-2" />
      </Button>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header>
          <Modal.Title style={{ fontSize: "18px" }}>
            <h5>Add To Cart</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <FormControl fullWidth className="mb-4">
            <InputLabel id="Select_Product">Select Product</InputLabel>
            <Select
              labelId="Select_Product"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              label="Select Product"
              size="small"
            >
              {productList.map((product) => (
                <MenuItem key={product.productId} value={product.productId}>
                  {product.productId}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}

          {/* <FormControl fullWidth className="mb-4">
      <InputLabel id="select-product-label">Select Product</InputLabel> */}
          {/* <Select
        labelId="select-product-label"
        value={productId}
        onChange={handleProductChange}
        label="Select Product"
        size="small"
      >
        {productList.map((product) => (
          <MenuItem key={product.productId} value={product.productId}>
            {product.productId}
          </MenuItem>
        ))}
      </Select> */}

          {/* <Autocomplete
        id="product-description"
        options={productList}
        getOptionLabel={(option) => option.productId}
        value={productList.find(product => product.productId === productId) || null}
        renderInput={(params) => <TextField {...params} label="Product Id" />}
        onChange={handleProductChange}
      />
      <Autocomplete
        className="mt-3"
        id="product-description"
        options={productList}
        getOptionLabel={(option) => option.productDescription}
        value={productList.find(product => product.productId === productId) || null}
        onChange={(event, newValue) => {
          setProductDescription(newValue ? newValue.productDescription : '');
          setProductId(newValue ? newValue.productId : '');
        }}
        renderInput={(params) => <TextField {...params} label="Product Description" />}
        disabled={!productId}
      />
    </FormControl> */}

          <FormControl fullWidth className="mb-4">
            <Autocomplete
              id="product-id"
              options={productList}
              getOptionLabel={(option) => option.productId}
              value={
                productList.find(
                  (product) => product.productId === productId
                ) || null
              }
              onChange={(event, newValue) => handleProductChange(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Product Id" />
              )}
            />
            <Autocomplete
              className="mt-3"
              id="product-description"
              options={productList}
              getOptionLabel={(option) => option.productDescription}
              value={
                productList.find(
                  (product) => product.productId === productId
                ) || null
              }
              onChange={(event, newValue) => handleProductChange(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Product Description" />
              )}
              disabled={!productId}
            />
          </FormControl>

          <TextField
            size="small"
            fullWidth
            label="Quantity"
            variant="outlined"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="success"
            variant="contained"
            className=" mx-2"
            onClick={handleAddToCart}
          >
            <FontAwesomeIcon icon={faSave} className="me-1 mx-2" />
            Save
          </Button>

          <Button
            color="warning"
            variant="contained"
            onClick={() => {
              setShowAddModal(false);
              setProductId("");
              setQuantity("");
            }}
          >
            <FontAwesomeIcon icon={faTimes} className="me-1 mx-2" />
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Card className="mb-4">
        {/* <Card.Header as="h6">
          <FontAwesomeIcon icon={faShoppingCart} className="me-2 mx-2" />
          Cart
        </Card.Header> */}
        <Card.Body>
          <div className="table-responsive">
            <TableContainer sx={{ maxHeight: 440, overflow: "auto" }}>
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
                      Description
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
                      Requested By
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        backgroundColor: "#3d3d3d",
                        color: "white",
                      }}
                      align="left"
                    >
                      Request Date
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
                  {items.map((item, index) => (
                    <StyledTableRow key={index}>
                      <TableCell align="left">
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
                            style={{ maxWidth: "90px" }}
                          />
                        ) : (
                          item.productId
                        )}
                      </TableCell>
                      <TableCell style={{ maxWidth: "200px" }} align="left">
                        {item.productDescription}
                      </TableCell>
                      <TableCell>
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
                            style={{ maxWidth: "90px" }} // Adjust the max-width as needed
                          />
                        ) : (
                          item.quantity
                        )}
                      </TableCell>
                      <TableCell align="left">{item.uom}</TableCell>
                      <TableCell align="left">{item.requestedBy}</TableCell>
                      <TableCell align="left">{item.requestDate}</TableCell>
                      <TableCell align="left">
                        {editIndex === index ? (
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={handleSaveEdit}
                          >
                            <FontAwesomeIcon icon={faSave} />
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="warning"
                            size="small"
                            onClick={() => handleEditItem(index)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                        )}
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          className="mx-2"
                          onClick={() => handleDeleteItem(index)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          <Button
            color="primary"
            variant="contained"
            className="mt-4"
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
