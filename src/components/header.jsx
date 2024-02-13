import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

const Header = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">
        <i className="bi bi-gear-fill"></i>&nbsp;
        Testing
      </Navbar.Brand>
      <Nav className="ml-auto">
        {/* Other navigation links if needed */}
      </Nav>
    </Navbar>
  );
};

export default Header;