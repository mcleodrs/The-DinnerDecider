import React from "react";

const Footer = () => {
  return (
    <footer style={{
      textAlign: "center",
      padding: "1rem",
      backgroundColor: "#fff5f0",
      borderTop: "1px solid #ddd",
      fontSize: "0.9rem",
      color: "#666"
    }}>
      <p>&copy; {new Date().getFullYear()} DinnerDecider. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
