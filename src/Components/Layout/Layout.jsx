import React from "react";
import { Container } from "semantic-ui-react";
import { ToastContainer } from "react-toastify";

import BaseHeader from "./BaseHeader";

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
