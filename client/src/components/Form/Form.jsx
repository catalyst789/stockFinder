import React, { useState } from "react";
import styles from "./Form.module.css";

const Form = ({ setStockDetails, setIsLoading }) => {
  const [stockSymbol, setStockSymbol] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setStockDetails(null);
    setIsLoading(true);
    // Perform any actions you need with the input values
    // For this example, we'll just display an alert with the entered values.
    try {
      fetch("http://localhost:5000/api/fetchStockData", {
        method: "POST",
        body: JSON.stringify({ stockSymbol: stockSymbol, date: selectedDate }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((result) => {
          setIsLoading(false);
          setStockDetails(result);
          console.log(result);
        })
        .catch((error) => {
          setIsLoading(false);
          console.log(error);
        });
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      return;
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Find Stock Information</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="stockSymbol">Stock Symbol:</label>
        <input
          type="text"
          id="stockSymbol"
          name="stockSymbol"
          value={stockSymbol}
          placeholder="Enter Stock Symbol"
          onChange={(e) => setStockSymbol(e.target.value)}
          required
        />

        <label htmlFor="selectedDate">Select a Date:</label>
        <input
          type="date"
          id="selectedDate"
          name="selectedDate"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          required
        />

        <button type="submit" className={styles.submitButton}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form;
