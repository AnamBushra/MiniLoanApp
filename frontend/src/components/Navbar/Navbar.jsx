import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../../images/logo.png";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("userInfo");
    const admin = localStorage.getItem("adminToken");
    if (admin) {
      setIsAdmin(true);
      setIsLoggedIn(true);
    }
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("adminToken");
    setIsLoggedIn(false);
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg p-1">
      <div className="container-fluid navwrapper">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="logo" className="logo" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {!isAdmin && (
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link
                  to={isLoggedIn ? "/all-loans" : "/login"}
                  className="nav-link mx-3"
                >
                  View Loans
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to={isLoggedIn ? "/loan-application" : "/login"}
                  className="nav-link mx-3"
                >
                  Apply for Loan
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to={isLoggedIn ? "/loan-repayment" : "/login"}
                  className="nav-link mx-3"
                >
                  Repay Loan
                </Link>
              </li>
            </ul>
          )}
          <ul className="navbar-nav ms-auto">
            {isLoggedIn ? (
              <li className="nav-item">
                <button
                  className="btn btn-primary navsignup"
                  onClick={handleLogout}
                >
                  Logout <i class="bi bi-box-arrow-right"></i>
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <Link to="/register" className="btn btn-primary navsignup">
                  Sign Up <i className="bi bi-arrow-right"></i>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
