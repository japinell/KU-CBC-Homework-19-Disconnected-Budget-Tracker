//
//  Functions to manage the local database
//
let db;
let budgetVersion;

// Create a new db request for the budget database
const request = indexedDB.open("budget", budgetVersion || 21);

request.onupgradeneeded = function (e) {
  console.log("Upgrade needed in local database");

  const { oldVersion } = e;
  const newVersion = e.newVersion || db.version;

  console.log(`DB Updated from version ${oldVersion} to ${newVersion}`);

  db = e.target.result;

  // If it does not exist, create the "transactions" storage
  if (db.objectStoreNames.length === 0) {
    db.createObjectStore("transactions", { autoIncrement: true });
  }
};

// Display error messages
request.onerror = (error) => {
  console.log(`Error: ${error.target.errorCode}`);
};

// Post the indexed (local) database records in bulk to the main database
function checkDatabase() {
  console.log("Check database invoked");

  // Open a connection to the transactions storage in read/write mode
  let transaction = db.transaction(["transactions"], "readwrite");

  // Assign the current store to a variable
  const store = transaction.objectStore("transactions");

  // Get all records from storage and set to a variable
  const getAll = store.getAll();

  // If the request was successful
  getAll.onsuccess = function () {
    // If there are items in storage, try to add them in bulk when the connection is back online
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((response) => {
          // If the response is not empty
          if (response.length !== 0) {
            // Open another connection to the transactions storage in read/write mode
            transaction = db.transaction(["transactions"], "readwrite");

            // Assign the current store to a variable
            const currentStore = transaction.objectStore("transactions");

            // Clear existing entries because the bulk add was successful
            currentStore.clear();
            console.log("Clearing store...");
          }
        });
    }
  };
}

// Check if the application is online before writing records from the local database to the main database
request.onsuccess = function (e) {
  console.log("Success");
  db = e.target.result;

  if (navigator.onLine) {
    console.log("Backend online!");
    checkDatabase();
  }
};

// Write a transactions to the local database
export const saveRecord = (record) => {
  console.log("Save record invoked");
  // Open a connection to the transactions storage in read/write mode
  const transaction = db.transaction(["transactions"], "readwrite");

  // Assign the current store to a variable
  const store = transaction.objectStore("transactions");

  // Add record to the transactions storage
  store.add(record);
};

// Listen for application coming back online
window.addEventListener("online", checkDatabase);
