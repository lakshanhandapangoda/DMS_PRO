import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortDown,
  faSortUp,
  faSearch,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@mui/material";
import baseURL from "../Auth/apiConfig";
import Card from "react-bootstrap/Card";
import { useLocation } from "react-router-dom";

const ViewRequest = () => {
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const branchCode = localStorage.getItem("branchCode");
        const refNo = location.pathname.split("/").pop();
        const response = await axios.get(
          `${baseURL}BranchRequestItems/ViewPendingDeliveryDetails/${refNo}/2/${branchCode}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setData(response.data);
      } catch (error) {
        if (error.response.status === 401) {
          window.location.href = "/login";
        }
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [location.pathname]);

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
    item.productDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="d-flex">
      <div className="flex-fill mr-2 ml-1">
        <Card>
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
                      onClick={() => requestSort("seqNo")}
                    >
                      Seq No <FontAwesomeIcon icon={getSortIcon("seqNo")} />
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        backgroundColor: "#3d3d3d",
                        color: "white",
                        cursor: "pointer",
                      }}
                      align="left"
                      onClick={() => requestSort("productId")}
                    >
                      Product ID{" "}
                      <FontAwesomeIcon icon={getSortIcon("productId")} />
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        backgroundColor: "#3d3d3d",
                        color: "white",
                        cursor: "pointer",
                      }}
                      align="left"
                      onClick={() => requestSort("productDescription")}
                    >
                      Description{" "}
                      <FontAwesomeIcon
                        icon={getSortIcon("productDescription")}
                      />
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        backgroundColor: "#3d3d3d",
                        color: "white",
                        cursor: "pointer",
                      }}
                      align="left"
                      onClick={() => requestSort("uom")}
                    >
                      UOM <FontAwesomeIcon icon={getSortIcon("uom")} />
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        backgroundColor: "#3d3d3d",
                        color: "white",
                        cursor: "pointer",
                      }}
                      align="left"
                      onClick={() => requestSort("orderQty")}
                    >
                      Order Qty{" "}
                      <FontAwesomeIcon icon={getSortIcon("orderQty")} />
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        backgroundColor: "#3d3d3d",
                        color: "white",
                        cursor: "pointer",
                      }}
                      align="left"
                      onClick={() => requestSort("deliveredQty")}
                    >
                      Delivered Qty{" "}
                      <FontAwesomeIcon icon={getSortIcon("deliveredQty")} />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.seqNo}>
                      <TableCell align="left">{item.seqNo}</TableCell>
                      <TableCell align="left">{item.productId}</TableCell>
                      <TableCell align="left">
                        {item.productDescription}
                      </TableCell>
                      <TableCell align="left">{item.uom}</TableCell>
                      <TableCell align="left">{item.orderQty}</TableCell>
                      <TableCell align="left">{item.deliveredQty}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button
              color="secondary"
              variant="contained"
              className="mt-4"
              onClick={handleGoBack}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-1 mx-2 " />
              Back
            </Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default ViewRequest;
