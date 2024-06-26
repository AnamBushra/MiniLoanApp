import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import img from "../../images/loanimg.png";

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("userInfo");
    const admin = localStorage.getItem("adminToken");
    if (user) {
      setIsLoggedIn(true);
    }
    if (admin) {
      setIsLoggedIn(true);
      setIsAdmin(true);
    }
  }, []);

  return (
    <div className="home-page">
      <section className="left-section">
        <h2>Welcome to LoanEase</h2>
        <p>Your go-to solution for quick and easy loan management.</p>
        <img src={img} alt="img" className="loan-img" />
      </section>
      <section className="right-section">
        {isAdmin ? (
          <div className="cta-buttons">
            <Link to="/admin" className="optionsbtn">
              Manage Loans
            </Link>
          </div>
        ) : isLoggedIn ? (
          <div className="cta-buttons">
            <Link to="/all-loans" className="optionsbtn">
              View Loans
            </Link>
            <Link to="/loan-application" className="optionsbtn">
              Apply Loan
            </Link>
            <Link to="/loan-repayment" className="optionsbtn">
              Repay Loan
            </Link>
          </div>
        ) : (
          <div className="cta-buttons">
            <Link to="/login" className="btn btn-primary login">
              Login
            </Link>
            <span>OR</span>
            <Link to="/register" className="btn btn-secondary signup">
              Sign Up
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
