import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import "./ViewLoansPage.css";

const ViewLoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [openRepayment, setOpenRepayment] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    const fetchLoans = async () => {
      const userId = localStorage.getItem("userInfo").replace(/['"]+/g, "");
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
  }, []);

  const toggleRepayment = (loanId) => {
    setIsModalOpen(true);
    setOpenRepayment((prev) => ({
      ...prev,
      [loanId]: !prev[loanId],
    }));
  };

  return (
    <div className="loansContainer">
      {loans.map((loan) => (
        <div key={loan._id} className="loanCard">
          <h3>Loan Amount: ₹{loan.amount}</h3>
          <p>Status: {loan.status}</p>
          <p>Term: {loan.term}</p>
          <p>Alternate Phone: {loan.alternatePhone}</p>
          <button onClick={() => toggleRepayment(loan._id)}>
            {openRepayment[loan._id] ? "Hide Repayments" : "Show Repayments"}
          </button>
          {openRepayment[loan._id] && (
            <Modal
              isOpen={isModalOpen}
              onRequestClose={closeModal}
              contentLabel="Repayment Details"
              className="repaymentModal"
              overlayClassName="repaymentOverlay"
            >
              <div className="repayments">
                {loan.repayments.map((repayment, index) => (
                  <div key={index} className="repayment">
                    <p>Repayment Date: {repayment.date.split("T")[0]}</p>
                    <p>Amount: ₹{repayment.amount}</p>
                    <p>Status: {repayment.status}</p>
                  </div>
                ))}
              </div>
              <button onClick={closeModal} className="closeModalButton">
                Close
              </button>
            </Modal>
          )}
        </div>
      ))}
    </div>
  );
};

export default ViewLoansPage;
