import React from "react";
import classNames from "classnames";
import { Container } from "reactstrap";
import { Switch, Route } from "react-router-dom";
import ItemRequest from "../layouts/ItemRequest";
import RequestApproval from "../layouts/RequestApproval";
import RequestDepartment from "../layouts/RequestDepartment";
import Home from "../layouts/Home";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import AssignUser from "../Auth/AssignUser";
import UserMaintenance from "../Auth/UserMaintenance";

import Topbar from "./Topbar";
import ViewRequest from "../layouts/ViewRequest";
import AcceptDelivery from "../layouts/AcceptDeliverys";
import IntarnalIssue from "../layouts/IntarnalIssue";

const Content = ({ sidebarIsOpen, toggleSidebar }) => (
  <Container
    fluid
    className={classNames("content", { "is-open": sidebarIsOpen })}
    style={{
      overflowY: "auto",
      maxHeight: "calc(100vh - 0px)",
      fontSize: "12px",
      backgroundColor: "#f0f5f7",
    }} // Adjust the height as needed
  >
    <Topbar toggleSidebar={toggleSidebar} />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/about" component={() => "About"} />
      <Route exact path="/Pages" component={() => "Pages"} />

      <Route exact path="/item-request" component={ItemRequest} />
      <Route exact path="/request-approval" component={RequestApproval} />
      <Route exact path="/request-department" component={RequestDepartment} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/view-request/:refNo" component={ViewRequest} />
      <Route exact path="/accept-deliverys" component={AcceptDelivery} />
      <Route exact path="/accept-deliverys" component={AcceptDelivery} />
      <Route exact path="/intarnal-issue" component={IntarnalIssue} />
      <Route
        exact
        path="/assign-user/:userId"
        render={(props) => <AssignUser {...props} />}
      />

      <Route exact path="/user-maintenance" component={UserMaintenance} />
    </Switch>
  </Container>
);

export default Content;
