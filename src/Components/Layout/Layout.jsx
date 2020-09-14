import React from "react";
import { Container } from "semantic-ui-react";
import BaseHeader from "./BaseHeader";
import { ToastContainer } from "react-toastify";

import "./Layout.css";

function Layout({ children }) {
  return (
    <Container>
      <ToastContainer autoClose={3000} />

      <BaseHeader />
      {children}
    </Container>
  );
}

export default Layout;
