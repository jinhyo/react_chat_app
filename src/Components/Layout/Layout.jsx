import React from "react";
import { Container } from "semantic-ui-react";
import BaseHeader from "./BaseHeader";
import "./Layout.css";

function Layout({ children }) {
  return (
    <Container>
      <BaseHeader />
      {children}
    </Container>
  );
}

export default Layout;
