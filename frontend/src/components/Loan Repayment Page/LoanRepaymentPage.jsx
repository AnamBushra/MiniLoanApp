import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import "./LoanRepaymentPage.css";

Modal.setAppElement("#root");

const LoanRepaymentPage = () => {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [repaymentAmount, setRepaymentAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userId = localStorage.getItem("userInfo").replace(/"/g, "");

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/loans/${userId}`
        );
        setLoans(response.data.loans);
      } catch (error) {
        console.error("Error fetching loans:", error);
      }
    };
    if (
      localStorage.getItem("userInfo") ||
      localStorage.getItem("adminToken")
    ) {
      fetchLoans();
    }
  }, [userId]);

  const handleRepay = async (repaymentId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/loans/${selectedLoan._id}/repay`,
        {
          repaymentId,
          amount: repaymentAmount,
        }
      );
      alert(response.data.message);
      setRepaymentAmount("");
      setIsModalOpen(false);
      setSelectedLoan(null);
      setLoans(
        loans.map((loan) =>
          loan._id === selectedLoan._id ? response.data.loan : loan
        )
      );
    } catch (error) {
      console.error("Error making repayment:", error);
    }
  };

  const openModal = (loan) => {
    setSelectedLoan(loan);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLoan(null);
  };

  return (
    <div className="repayLoanContainer">
      <h1 className="title">Repay Loan</h1>
      <div className="loansList">
        {loans.map((loan) => (
          <div key={loan._id} className="loanCard">
            <h3>Loan Amount: ₹{loan.amount}</h3>
            <p>Status: {loan.status}</p>
            <button onClick={() => openModal(loan)}>View Repayments</button>
          </div>
        ))}
      </div>
      {selectedLoan && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Repayment Details"
          className="repaymentModal"
          overlayClassName="repaymentOverlay"
        >
          <h2 style={{ color: "gray" }}>
            Repayments for Loan: ₹{selectedLoan.amount}
          </h2>
          {selectedLoan.repayments.map((repayment) => (
            <div key={repayment._id} className="repaymentItem">
              <p>Date: {repayment.date.split("T")[0]}</p>
              <p>Amount: ₹{repayment.amount}</p>
              <p>Status: {repayment.status}</p>
              {repayment.status === "PENDING" && (
                <div>
                  <input
                    type="number"
                    placeholder="Repayment Amount"
                    value={repaymentAmount}
                    onChange={(e) => setRepaymentAmount(e.target.value)}
                  />
                  <button onClick={() => handleRepay(repayment._id)}>
                    Repay
                  </button>
                </div>
              )}
            </div>
          ))}
          <button onClick={closeModal} className="closeModalButton">
            Close
          </button>
        </Modal>
      )}
    </div>
  );
};

export default LoanRepaymentPage;
