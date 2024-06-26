import React, { useState } from "react";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin) {
        const { data } = await axios.post("http://localhost:5000/api/login", {
          email,
          password,
        });
        localStorage.setItem("userInfo", JSON.stringify(data.userId));
        navigate("/");
      } else {
        const response = await axios.post(
          "http://localhost:5000/api/admin/login",
          {
            email,
            password,
          }
        );
        localStorage.setItem("adminToken", response.data.token);
        navigate("/admin");
      }
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  return (
    <section className="loginContainer overflow-hidden">
      <div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
        <div className="row gx-lg-5 align-items-center mb-5">
          <div className="col-lg-6 mb-5 mb-lg-0" style={{ zIndex: 10 }}>
            <h1
              className="my-5 display-5 fw-bold ls-tight"
              style={{ color: "hsl(218, 81%, 95%)" }}
            >
              No Need To Worry About Money <br />
              <span style={{ color: "hsl(218, 81%, 75%)" }}>We're Here</span>
            </h1>
          </div>

          <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
            <div className="card bg-glass">
              <div className="card-body px-4 py-5 px-md-5">
                <form onSubmit={handleSubmit}>
                  {error && <div className="alert alert-danger">{error}</div>}
                  <div className="form-outline mb-4">
                    <input
                      type="email"
                      id="form3Example3"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                    <label className="form-label" htmlFor="form3Example3">
                      Email address
                    </label>
                  </div>

                  <div className="form-outline mb-4">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="form3Example4"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                    <label className="form-label" htmlFor="form3Example4">
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

                  <button
                    type="submit"
                    className="btn btn-primary btn-block mb-4"
                  >
                    Login
                  </button>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckDefault"
                      onClick={() => {
                        setIsAdmin(!isAdmin);
                      }}
                    />
                    <label class="form-check-label" for="flexCheckDefault">
                      Are You An Admin?
                    </label>
                  </div>
                  <p className="small fw-bold mt-2 pt-1 mb-0">
                    Don't have an account?
                    <Link to="/register" className="link-danger">
                      Sign Up
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

export default LoginPage;
