import { useState } from "react";
import Form from "./components/Form/Form";
import styles from "./App.module.css";
import loader from "./assets/Double Ring-1s-200px.svg";

function App() {
  const [stockDetails, setStockDetails] = useState(null);
  const [isLoding, setIsLoading] = useState(false);

  return (
    <>
      <Form setStockDetails={setStockDetails} setIsLoading={setIsLoading} />
      {isLoding && (
        <div className={styles.loading}>
          <img src={loader} alt="loading..." />
        </div>
      )}
      {stockDetails ? (
        stockDetails.errorCode === 0 ? (
          <div className={styles.stockDetails}>
            <h3>Stock Details: {stockDetails.data.symbol}</h3>
            <p>On Date: {stockDetails.data.from}</p>
            <p>Open: {stockDetails.data.open}</p>
            <p>High: {stockDetails.data.high}</p>
            <p>Low: {stockDetails.data.low}</p>
            <p>Close: {stockDetails.data.close}</p>
            <p>Volume: {stockDetails.data.volume}</p>
          </div>
        ) : (
          <h3 className={styles.errorMessage}>
            {stockDetails?.errorMessage
              ? stockDetails.errorMessage
              : "Something went wrong"}
          </h3>
        )
      ) : (
        ""
      )}
    </>
  );
}

export default App;
