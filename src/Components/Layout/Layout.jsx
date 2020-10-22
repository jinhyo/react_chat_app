import React from "react";
import { Container } from "semantic-ui-react";
import BaseHeader from "./BaseHeader";
import { ToastContainer } from "react-toastify";

function Layout({ children }) {
  return (
    <Container>
      <BaseHeader />
      <ToastContainer autoClose={3000} />
      {children}
    </Container>
  );
}

export default Layout;
