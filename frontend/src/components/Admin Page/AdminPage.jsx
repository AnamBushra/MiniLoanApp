import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPage.css";

const AdminPage = () => {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/allloans");
        setLoans(response.data.loans);
      } catch (error) {
        console.error("Error fetching loans:", error);
      }
    };

    fetchLoans();
  }, []);

  const handleApprove = async (loanId) => {
    if (window.confirm("Are you sure you want to approve this loan?")) {
      try {
        const response = await axios.post(
          `http://localhost:5000/api/allloans/${loanId}/approve`
        );
        alert(response.data.message);
        setLoans(
          loans.map((loan) => (loan._id === loanId ? response.data.loan : loan))
        );
      } catch (error) {
        console.error("Error approving loan:", error);
      }
    }
  };

  return (
    <div className="manageLoansContainer">
      <h1 className="title">Manage Loans</h1>
      <div className="loansList">
        {loans.map((loan) => (
          <div key={loan._id} className="loanCard">
            <h3>Loan Amount: ₹{loan.amount}</h3>
            <p>Status: {loan.status}</p>
            <h4>User Details</h4>
            <p>
              Name: {loan.user.firstName} {loan.user.lastName}
            </p>
            <p>Email: {loan.user.email}</p>
            <p>Phone: {loan.user.phone}</p>
            {loan.status === "PENDING" ? (
              <button onClick={() => handleApprove(loan._id)}>
                Approve Loan
              </button>
            ) : (
              <h4 style={{ color: "green" }}>Approved</h4>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
