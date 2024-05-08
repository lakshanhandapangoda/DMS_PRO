import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import baseURL from "../Auth/apiConfig";
import {
  faSort,
  faSortDown,
  faSortUp,
  faSearch,
  faArrowLeft,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@mui/material";
import Card from "react-bootstrap/Card";
import { useLocation } from "react-router-dom";
import { Alert } from "react-bootstrap";

const AcceptDelivery = () => {
  const [data, setData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [sortedData, setSortedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [responseBottomTable, setResponseBottomTable] = useState([]); // State to hold response data for the bottom table
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const branchCode = localStorage.getItem("branchCode");
        const userId = localStorage.getItem("user_id");

        // Body parameters
        const bodyParams = {
          branchCode: branchCode,
          refNo: 0,
          userID: "",
        };
        const response = await axios.post(
          `${baseURL}DeliveryOrderAccept/GetPendingToAcceptDeliveryDetails`,
          bodyParams, // Pass the body parameters directly here
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(response.data);
      } catch (error) {
        if (error.response.status === 401) {
          window.location.href = "/login";
        }
        setShowAlert({
          type: "error",
          message: error.response.data.toString(),
        });

        setTimeout(() => setShowAlert(false), 3000);

        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const sorted = [...data].sort((a, b) => {
        if (sortConfig.direction === "ascending") {
          return a[sortConfig.key] - b[sortConfig.key];
        } else {
          return b[sortConfig.key] - a[sortConfig.key];
        }
      });
      setSortedData(sorted);
    }
  }, [data, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? faSortUp : faSortDown;
    }
    return faSort;
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = sortedData.filter((item) =>
    item.docCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = async (item) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${baseURL}DeliveryOrderAccept/ViewPendingToAcceptProductDetails`,
        {
          docCode: item.docCode,
          txnCode: item.txnCode,
          txnYear: item.txnYear,
          deliveryNo: item.deliveryNo,
          deliveryDate: item.deliveryDate,
          refNo: "",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setResponseBottomTable(response.data); // Update state with response data for bottom table
    } catch (error) {
      if (error.response.status === 401) {
        window.location.href = "/login";
      }
      setShowAlert({
        type: "error",
        message: error.response.data.toString(),
      });

      setTimeout(() => setShowAlert(false), 3000);
      console.error("Error viewing data:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const branchCode = localStorage.getItem("branchCode");
      const branchFlag = 2; // Assuming branchFlag is static

      // Add branchCode and branchFlag to each item in responseBottomTable
      const updatedData = responseBottomTable.map((item) => ({
        ...item,
        branchCode: branchCode,
        branchFlag: branchFlag,
      }));

      const response = await axios.post(
        `${baseURL}DeliveryOrderAccept/PostDeliveryAccept`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setShowAlert({
        type: "success",
        message: "Data submitted successfully.",
      });
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      if (error.response.status === 401) {
        window.location.href = "/login";
      }
      setShowAlert({
        type: "error",
        message: error.response.data.toString(),
      });

      setTimeout(() => setShowAlert(false), 3000);
      console.error("Error submitting data:", error);
    }
  };

  const handleCancel = () => {
    setResponseBottomTable([]);
  };

  const handleGoBack = () => {
    window.history.back();
  };
  return (
    <div>
      <Card>
        {/* Display the alert when showAlert is true */}
        {showAlert && (
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
        <Card.Body>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <div className="input-group-append">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faSearch} />
              </span>
            </div>
          </div>
          <TableContainer sx={{ maxHeight: "400px", overflowY: "auto" }}>
            <Table stickyHeader aria-label="sticky table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      backgroundColor: "#3d3d3d",
                      color: "white",
                      cursor: "pointer",
                    }}
                    align="left"
                    onClick={() => requestSort("docCode")}
                  >
                    Doc Code <FontAwesomeIcon icon={getSortIcon("docCode")} />
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      backgroundColor: "#3d3d3d",
                      color: "white",
                      cursor: "pointer",
                    }}
                    align="left"
                    onClick={() => requestSort("txnCode")}
                  >
                    Txn Code <FontAwesomeIcon icon={getSortIcon("txnCode")} />
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      backgroundColor: "#3d3d3d",
                      color: "white",
                      cursor: "pointer",
                    }}
                    align="left"
                    onClick={() => requestSort("txnYear")}
                  >
                    Txn Year <FontAwesomeIcon icon={getSortIcon("txnYear")} />
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      backgroundColor: "#3d3d3d",
                      color: "white",
                      cursor: "pointer",
                    }}
                    align="left"
                    onClick={() => requestSort("deliveryNo")}
                  >
                    Delivery No{" "}
                    <FontAwesomeIcon icon={getSortIcon("deliveryNo")} />
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      backgroundColor: "#3d3d3d",
                      color: "white",
                      cursor: "pointer",
                    }}
                    align="left"
                    onClick={() => requestSort("deliveryDate")}
                  >
                    Delivery Date{" "}
                    <FontAwesomeIcon icon={getSortIcon("deliveryDate")} />
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      backgroundColor: "#3d3d3d",
                      color: "white",
                      cursor: "pointer",
                    }}
                    align="left"
                    onClick={() => requestSort("refNo")}
                  >
                    Ref No <FontAwesomeIcon icon={getSortIcon("refNo")} />
                  </TableCell>

                  <TableCell
                    style={{
                      fontWeight: "bold",
                      backgroundColor: "#3d3d3d",
                      color: "white",
                      cursor: "pointer",
                    }}
                    align="left"
                    onClick={() => requestSort("refNo")}
                  >
                    Action <FontAwesomeIcon icon={getSortIcon("refNo")} />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.seqNo}>
                    <TableCell align="left">{item.docCode}</TableCell>
                    <TableCell align="left">{item.txnCode}</TableCell>
                    <TableCell align="left">{item.txnYear}</TableCell>
                    <TableCell align="left">{item.deliveryNo}</TableCell>
                    <TableCell align="left">{item.deliveryDate}</TableCell>
                    <TableCell align="left">{item.refNo}</TableCell>
                    <TableCell align="cnter">
                      <Button
                        color="warning"
                        variant="contained"
                        size="small"
                        onClick={() => handleView(item)} // Pass a function reference to handleView
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card.Body>
      </Card>

      <div className="mt-4">
        <Card>
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
                        cursor: "pointer",
                      }}
                    >
                      Product ID
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        backgroundColor: "#3d3d3d",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      Description
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        backgroundColor: "#3d3d3d",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      UOM
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        backgroundColor: "#3d3d3d",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      Quantity
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        backgroundColor: "#3d3d3d",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      Comments
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {responseBottomTable.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell align="left">{item.productId}</TableCell>
                      <TableCell align="left">
                        {item.productDescription}
                      </TableCell>
                      <TableCell align="left">{item.uom}</TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="left">
                        <TextField
                          size="small"
                          fullWidth
                          id={`comments-${index}`}
                          value={item.comments}
                          onChange={(e) => {
                            const updatedResponse = [...responseBottomTable];
                            updatedResponse[index].comments = e.target.value;
                            setResponseBottomTable(updatedResponse);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <div className="d-flex justify-content-start mt-4">
              <Button
                color="primary"
                variant="contained"
                className=" mx-2"
                onClick={handleSubmit}
              >
                <FontAwesomeIcon icon={faSave} className="me-1 mx-2" />
                Save
              </Button>
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
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default AcceptDelivery;
