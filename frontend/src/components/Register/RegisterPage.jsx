import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./RegisterPage.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const validateForm = () => {
    if (
      !firstName ||
      !lastName ||
      !phone ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      return "All fields are required.";
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return "Invalid phone number.";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        firstName,
        lastName,
        phone,
        email,
        password,
      });
      navigate("/login");
    } catch (err) {
      console.error(
        "Registration error:",
        err.response ? err.response.data : err.message
      );
      setError(
        err.response
          ? err.response.data.message
          : "Registration failed. Please try again."
      );
    }
  };

  return (
    <section className="registerContainer overflow-hidden">
      <div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
        <div className="row gx-lg-5 align-items-center mb-5">
          <div className="col-lg-6 mb-5 mb-lg-0" style={{ zIndex: 10 }}>
            <h1
              className="my-5 display-5 fw-bold ls-tight"
              style={{ color: "hsl(218, 81%, 95%)" }}
            >
              Become a Member <br />
              <span style={{ color: "hsl(218, 81%, 75%)" }}>
                and Forget About Your Tensions
              </span>
            </h1>
          </div>
          <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
            <div className="card bg-glass">
              <div className="card-body px-4 py-5 px-md-5">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-outline">
                        <input
                          type="text"
                          id="form3Example1"
                          className="form-control"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                        <label className="form-label" htmlFor="form3Example1">
                          First name
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-outline">
                        <input
                          type="text"
                          id="form3Example2"
                          className="form-control"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                        <label className="form-label" htmlFor="form3Example2">
                          Last name
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="form-outline mb-4">
                    <input
                      type="tel"
                      id="form3Example3"
                      className="form-control"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <label className="form-label" htmlFor="form3Example3">
                      Mobile Number
                    </label>
                  </div>
                  <div className="form-outline mb-4">
                    <input
                      type="email"
                      id="form3Example4"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label className="form-label" htmlFor="form3Example4">
                      Email address
                    </label>
                  </div>
                  <div className="form-outline mb-4 position-relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="form3Example5"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <label className="form-label" htmlFor="form3Example5">
                      Password
                    </label>

                    {showPassword ? (
                      <i
                        class="bi bi-eye-slash-fill"
                        onClick={() => setShowPassword(!showPassword)}
                      ></i>
                    ) : (
                      <i
                        class="bi bi-eye-fill"
                        onClick={() => setShowPassword(!showPassword)}
                      ></i>
                    )}
                  </div>
                  <div className="form-outline mb-4">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="form3Example6"
                      className="form-control"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <label className="form-label" htmlFor="form3Example6">
                      Confirm Password
                    </label>
                  </div>
                  {error && <p className="text-danger">{error}</p>}
                  <button
                    type="submit"
                    className="btn btn-primary btn-block mb-4"
                  >
                    Sign up
                  </button>
                  <p className="small fw-bold mt-2 pt-1 mb-0">
                    Already have an account?{" "}
                    <Link to="/login" className="link-danger">
                      Login
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
