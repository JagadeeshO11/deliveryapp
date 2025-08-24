import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaBoxOpen, FaHome, FaWallet, FaUser } from "react-icons/fa";

const Layout = () => {
  const location = useLocation();

  const links = [
    { to: "/Order", label: "Order Details", icon: <FaBoxOpen /> },
    { to: "/", label: "Dashboard", icon: <FaHome /> },
    { to: "/wallet", label: "Wallet", icon: <FaWallet /> },
  ];

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <Navbar bg="primary" variant="dark" fixed="top" className="px-3">
        <Container fluid className="d-flex justify-content-between align-items-center">
          {/* Logo */}
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <img
              src="/logo192.png"
              alt="logo"
              width="30"
              height="30"
              className="d-inline-block align-top me-2"
            />
            <span className="fw-bold">DeliveryApp</span>
          </Navbar.Brand>

          {/* Desktop Menu */}
          <Nav className="d-none d-md-flex">
            {links.map((link) => (
              <Nav.Link
                as={Link}
                to={link.to}
                key={link.to}
                className={location.pathname === link.to ? "fw-bold text-warning" : ""}
              >
                {link.label}
              </Nav.Link>
            ))}
            <Nav.Link
              as={Link}
              to="/profile"
              className={location.pathname === "/profile" ? "fw-bold text-warning" : ""}
            >
              Profile
            </Nav.Link>
          </Nav>

          {/* Mobile: Profile Icon only */}
          <Link to="/profile" className="d-md-none text-white fs-4">
            <FaUser />
          </Link>
        </Container>
      </Navbar>

      {/* Main Content */}
      <main className="flex-grow-1 mt-5 mb-5">
        <Container>
          <Outlet />
        </Container>
      </main>

      {/* Bottom Nav (Mobile only) */}
      <footer className="d-md-none bg-white border-top shadow-sm fixed-bottom">
        <div className="d-flex justify-content-around py-2">
          {links.map((link, index) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-center ${
                location.pathname === link.to ? "text-primary fw-bold" : "text-dark"
              } ${index === 1 ? "rounded-circle bg-primary text-white px-3 py-2 shadow" : ""}`}
              style={{ textDecoration: "none" }}
            >
              <div className="fs-5">{link.icon}</div>
              <div style={{ fontSize: "12px" }}>{link.label}</div>
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default Layout;
