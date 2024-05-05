import React, { useState, useEffect, ChangeEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faSave,
  faPlus,
  faTimes,
  faShoppingCart,
  faArrowLeft,
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
        const branchCode = localStorage.getItem("branchCode");
        const response = await axios.post(
          `${baseURL}BranchRequestItems/GetAllActiveProductList`,
          {
            branchCode: branchCode,
            refNo: 0,
            userID: "",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProductList(response.data);
      } catch (error) {
        setShowAlert({
          type: "error",
          message: error.toString(),
        });
        setTimeout(() => setShowAlert(false), 3000);
        console.error("Error fetching product list:", error);
      }
    };

    fetchProductList();

    fetchAuthorizeProductList();
  }, []);

  const fetchAuthorizeProductList = async () => {
    try {
      const token = localStorage.getItem("token");
      const branchCode = localStorage.getItem("branchCode");
      const response = await axios.post(
        `${baseURL}BranchRequestItems/GetUnAuthorizeItemRequestList`,
        {
          branchCode: branchCode,
          refNo: 0,
          userID: "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setItems(response.data);
    } catch (error) {
      setShowAlert({
        type: "error",
        message: error.toString(),
      });
      setTimeout(() => setShowAlert(false), 3000);
      console.error("Error fetching product list:", error);
    }
  };

  const handleAddToCart = async () => {
    const currentDate = new Date();
    const selectedProduct = productList.find(
      (product) => product.productId === productId
    );

    if (!quantity) {
      setShowAlert({
        type: "error",
        message: "Quantity is required to add the product to the cart.",
      });
      setTimeout(() => setShowAlert({ type: "", message: "" }), 3000);
      return;
    }

    if (selectedProduct) {
      /* const existingItemIndex = items.findIndex(
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
      }*/

      try {
        const token = localStorage.getItem("token");
        const branchCode = localStorage.getItem("branchCode");
        const requestData = [
          {
            branchCode: branchCode,
            productId: selectedProduct.productId,
            productDescription: selectedProduct.productDescription || "",
            uom: selectedProduct.uom,
            quantity: parseFloat(quantity),
            requestBy: localStorage.getItem("user_id"),
            requestDate: new Date().toISOString(),
            requestWorkStation: "::1",
          },
        ];

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
        fetchAuthorizeProductList();
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

      setProductId("");
      setQuantity("");
      setRequestDate("");
      setShowAddModal(false);
    } else {
      console.error("Selected product not found in the product list.");
    }
  };

  const handleDeleteItem = async (item) => {
    //const updatedItems = [...items];
    // updatedItems.splice(index, 1);
    //setItems(updatedItems);

    try {
      const token = localStorage.getItem("token");
      const branchCode = localStorage.getItem("branchCode");
      const requestData = {
        branchCode: branchCode,
        productId: item.productId,
        productDescription: item.productDescription || "",
        uom: item.uom,
        quantity: parseFloat(item.quantity),
        requestBy: localStorage.getItem("user_id"),
        requestDate: new Date().toISOString(),
        requestWorkStation: "::1",
      };

      const response = await axios.post(
        `${baseURL}BranchRequestItems/DeleteUnAuthorizedItem`,
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
        message: "Request deleted successful",
      });
      setTimeout(() => setShowAlert({ type: "", message: "" }), 3000);
      fetchAuthorizeProductList();
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

  const handleEditItem = async (index) => {
    setEditIndex(index);
  };

  const handleSaveEdit = async (item) => {
    setEditIndex(null);
    console.log(item);
    try {
      const token = localStorage.getItem("token");
      const branchCode = localStorage.getItem("branchCode");
      const requestData = {
        branchCode: branchCode,
        productId: item.productId,
        productDescription: item.productDescription || "",
        uom: item.uom,
        quantity: parseFloat(item.quantity),
        requestBy: localStorage.getItem("user_id"),
        requestDate: new Date().toISOString(),
        requestWorkStation: "::1",
      };

      const response = await axios.post(
        `${baseURL}BranchRequestItems/UpdateUnAuthorizedItem`,
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
        message: "Request updated successful",
      });
      setTimeout(() => setShowAlert({ type: "", message: "" }), 3000);
      fetchAuthorizeProductList();
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
      setQuantity(newValue.unAuthorizeQuantity);
    } else {
      setProductDescription("");
      setProductId("");
    }
  };

  const handleCancel = () => {
    setItems([]);
  };

  const handleGoBack = () => {
    window.history.back();
  };

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
          <FormControl fullWidth className="mb-4">
            <Autocomplete
              id="product-id"
              options={productList}
              getOptionLabel={(option) => option.productDescription}
              value={
                productList.find(
                  (product) => product.productId === productId
                ) || null
              }
              onChange={(event, newValue) => handleProductChange(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Product" />
              )}
            />
          </FormControl>

          <TextField
            size="small"
            fullWidth
            label="Quantity"
            variant="outlined"
            type="number"
            inputProps={{ min: "0" }} // Use inputProps to set the minimum value
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
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
                      <TableCell align="left">{item.productId}</TableCell>
                      <TableCell style={{ maxWidth: "200px" }} align="left">
                        {item.productDescription}
                      </TableCell>
                      <TableCell>
                        {editIndex === index ? (
                          <input
                            type="number"
                            min="0"
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
                      <TableCell align="left">{item.requestBy}</TableCell>
                      <TableCell align="left">
                        {new Date(item.requestDate).toLocaleString()}
                      </TableCell>
                      <TableCell align="left">
                        {editIndex === index ? (
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleSaveEdit(item)}
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
                          onClick={() => handleDeleteItem(item)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <div className="d-flex justify-content-start mt-4">
              <Button
                color="warning"
                variant="contained"
                onClick={handleCancel}
              >
                <FontAwesomeIcon icon={faTimes} className="me-1 mx-2" />
                Clear
              </Button>

              <Button
                color="secondary"
                variant="contained"
                className=" mx-2"
                onClick={handleGoBack}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="me-1 mx-2" />
                Back
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ItemRequest;
