import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./components/Home Page/HomePage";
import RegisterPage from "./components/Register/RegisterPage";
import LoginPage from "./components/Login/LoginPage";
import LoanApplicationPage from "./components/Loan Application Page/LoanApplicationPage";
import ViewLoansPage from "./components/All Loans Page/ViewLoansPage";
import LoanRepaymentPage from "./components/Loan Repayment Page/LoanRepaymentPage";
import AdminPage from "./components/Admin Page/AdminPage";
import Navbar from "./components/Navbar/Navbar";

function App() {
  const Home = () => {
    return (
      <div className="App">
        <Navbar />
        <HomePage />
      </div>
    );
  };
  const Register = () => {
    return (
      <div className="App">
        <Navbar />
        <RegisterPage />
      </div>
    );
  };
  const Login = () => {
    return (
      <div className="App">
        <Navbar />
        <LoginPage />
      </div>
    );
  };
  const ViewLoans = () => {
    return (
      <div className="App">
        <Navbar />
        <ViewLoansPage />
      </div>
    );
  };
  const LoanRepayment = () => {
    return (
      <div className="App">
        <Navbar />
        <LoanRepaymentPage />
      </div>
    );
  };
  const LoanApplication = () => {
    return (
      <div className="App">
        <Navbar />
        <LoanApplicationPage />
      </div>
    );
  };
  const Admin = () => {
    return (
      <div className="App">
        <Navbar />
        <AdminPage />
      </div>
    );
  };
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/loan-application",
      element: <LoanApplication />,
    },
    {
      path: "/loan-repayment",
      element: <LoanRepayment />,
    },
    {
      path: "/all-loans",
      element: <ViewLoans />,
    },
    {
      path: "/admin",
      element: <Admin />,
    },
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
