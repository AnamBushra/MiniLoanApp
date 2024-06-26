import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LoanApplicationPage.css";
import { useNavigate } from "react-router-dom";

const LoanApplicationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    alternatePhone: "",
    loanAmount: "",
    loanPurpose: "",
    loanTerm: "",
  });
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userInfo");
    if (storedUserId) {
      setUserId(storedUserId.replace(/"/g, "").trim());
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const calculateRepaymentSchedule = (loanAmount, loanTerm) => {
    const weeklyPayment = loanAmount / loanTerm;
    const repayments = [];

    for (let i = 1; i <= loanTerm; i++) {
      const repaymentDate = new Date();
      repaymentDate.setDate(repaymentDate.getDate() + 7 * i);
      repayments.push({
        date: repaymentDate.toISOString().split("T")[0],
        amount: weeklyPayment.toFixed(2),
      });
    }

    return repayments;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const repayments = calculateRepaymentSchedule(
      formData.loanAmount,
      formData.loanTerm
    );
    const dataToSend = {
      userId: userId,
      alternatePhone: formData.alternatePhone,
      loanAmount: formData.loanAmount,
      loanPurpose: formData.loanPurpose,
      loanTerm: formData.loanTerm,
      repayments,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/loans",
        dataToSend
      );
      navigate("/all-loans");
    } catch (error) {
      console.error("Error submitting loan application:", error);
    }
  };

  return (
    <div className="formContainer">
      <div className="loanApplicationContainer">
        <h1 className="title">Apply for Loan</h1>
        <form className="form" onSubmit={handleSubmit}>
          <label className="form-label">
            Alternate Phone
            <input
              type="tel"
              name="alternatePhone"
              value={formData.alternatePhone}
              onChange={handleChange}
              className="form-control"
              pattern="^[6789]\d{9}$"
              required
            />
          </label>
          <label className="form-label">
            Loan Amount (in INR)
            <input
              type="number"
              name="loanAmount"
              value={formData.loanAmount}
              onChange={handleChange}
              className="form-control"
              required
            />
          </label>
          <label className="form-label">
            Term
            <input
              type="number"
              name="loanTerm"
              value={formData.loanTerm}
              onChange={handleChange}
              className="form-control"
              required
            />
          </label>
          <label className="form-label">
            Loan Purpose
            <input
              type="text"
              name="loanPurpose"
              value={formData.loanPurpose}
              onChange={handleChange}
              className="form-control"
              required
            />
          </label>
          <button type="submit" className="button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoanApplicationPage;
