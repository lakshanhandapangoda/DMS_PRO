import React from "react";
import Table from "react-bootstrap/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import {
  faEye,
  faCartPlus,
} from "@fortawesome/free-solid-svg-icons";
import Form from "react-bootstrap/Form";
import { Link } from 'react-router-dom';

function RequestApproval() {
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
            <Card.Header as="h6">Unauthorized Cart</Card.Header>
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
                  <tr>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    <td>@mdo</td>
                    <td>
            <Form.Check
            inline
            name="group1" className="mx-4"/>
                    </td>
                  </tr>
                  <tr>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    <td>@mdo</td>
                    <td>
                    <Form.Check
            inline
            name="group1" className="mx-4"/>
                    </td>
                  </tr>

                  <tr>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    <td>@mdo</td>
                    <td>
                    <Form.Check
            inline
            name="group1" className="mx-4"/>
                    </td>
                  </tr>
                </tbody>
              </Table>
              <Form.Select aria-label="Default select example" className="mt-4">
                <option>Open this select menu</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </Form.Select>

              <div className="mt-4">
            <Button variant="outline-primary " className="mr-3" >
                Send Request
            </Button>
            <Button variant="outline-warning mx-2" className="mr-3  mx-2" >
                Clear
            </Button>
            <Button variant="outline-success" className="mr-3"  >
                Exit
            </Button>
        </div>
            </Card.Body>
          </Card>
        </div>
        <div className="flex-fill ml-3 mx-4">
          <Card>
            <Card.Header as="h6">Pending Delivery</Card.Header>
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
                  <tr>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    <td>
                      <Button variant="primary" size="sm" className="mr-2 mx-2">
                        <FontAwesomeIcon icon={faEye} />
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    <td>
                      <Button variant="primary" size="sm" className="mr-2 mx-2">
                        <FontAwesomeIcon icon={faEye} />
                      </Button>
                    </td>
                  </tr>

                  <tr>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    <td>
                      <Button variant="primary" size="sm" className="mr-2 mx-2">
                        <FontAwesomeIcon icon={faEye} />
                      </Button>
                    </td>
                  </tr>
                  
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default RequestApproval;
