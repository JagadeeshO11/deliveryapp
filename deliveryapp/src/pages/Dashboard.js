// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Container } from "react-bootstrap";
import Navbar from "../components/Navbar"; // ✅ Import Navbar

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div>
      {/* ✅ Navbar always on top */}
      <Navbar />

      {/* Main Content */}
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Card className="p-4 shadow text-center">
          <h3>🚧 Work in Progress 🚧</h3>
          <p>Dashboard features will be available soon.</p>
          {user && <p className="text-muted">Welcome back, {user.name}!</p>}
        </Card>
      </Container>
    </div>
  );
};

export default Dashboard;
