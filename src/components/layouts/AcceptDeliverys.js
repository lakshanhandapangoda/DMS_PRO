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
import Card from "react-bootstrap/Card";
import { useLocation } from "react-router-dom";

const AcceptDelivery = () => {
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
        const response = await axios.get(
          `http://119.8.182.69/PBBInventoryAPI/api/DeliveryOrderAccept/GetPendingToAcceptDeliveryDetails/2/${branchCode}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
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
      </div>
    </div>
  );
};

export default AcceptDelivery;
