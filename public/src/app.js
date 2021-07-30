//
//  Main program
//
import { populateTotal, populateTable } from "./dom";
import { populateChart } from "./chart";
import { saveRecord } from "./db";
//
let transactions = [];
// Fetch all transactions
fetch("/api/transaction")
  .then((response) => {
    return response.json();
  })
  .then((response) => {
    // Save the db response on global variable
    transactions = response;
    // Populate user interface with records
    populateTotal(transactions);
    populateTable(transactions);
    populateChart(transactions);
  });

// Post the transaction to the database
function sendTransaction(isAdding) {
  let nameEl = document.querySelector("#t-name");
  let amountEl = document.querySelector("#t-amount");
  let errorEl = document.querySelector(".form .error");

  // Validate form
  if (nameEl.value === "" || amountEl.value === "") {
    errorEl.textContent = "Missing Information";
    return;
  } else {
    errorEl.textContent = "";
  }

  // Create record
  let transaction = {
    name: nameEl.value,
    value: amountEl.value,
    date: new Date().toISOString(),
  };

  // If subtracting funds, convert amount to negative number
  if (!isAdding) {
    transaction.value *= -1;
  }

  // Add to beginning of current array of data
  transactions.unshift(transaction);

  // Populate user interface with new record
  populateChart(transactions);
  populateTable(transactions);
  populateTotal(transactions);

  // Post transaction to to database
  fetch("/api/transaction", {
    method: "POST",
    body: JSON.stringify(transaction),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      if (response.errors) {
        errorEl.textContent = "Missing Information";
      } else {
        // Clear form
        nameEl.value = "";
        amountEl.value = "";
      }
    })
    .catch(() => {
      // Fetch failed, so save in the indexed (local) db
      saveRecord(transaction);

      // Clear form
      nameEl.value = "";
      amountEl.value = "";
    });
}

// Register the click even on the add and submit buttons
document.querySelector("#add-btn").onclick = function () {
  sendTransaction(true);
};

document.querySelector("#sub-btn").onclick = function () {
  sendTransaction(false);
};
