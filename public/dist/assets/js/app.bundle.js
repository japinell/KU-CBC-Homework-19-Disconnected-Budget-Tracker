/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./public/src/app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./public/src/app.js":
/*!***************************!*\
  !*** ./public/src/app.js ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom */ \"./public/src/dom.js\");\n/* harmony import */ var _chart__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./chart */ \"./public/src/chart.js\");\n/* harmony import */ var _db__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./db */ \"./public/src/db.js\");\n/* harmony import */ var _db__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_db__WEBPACK_IMPORTED_MODULE_2__);\n//\n//  Main program\n//\n\n\n //\n\nvar transactions = []; // Fetch all transactions\n\nfetch(\"/api/transaction\").then(function (response) {\n  return response.json();\n}).then(function (response) {\n  // Save the db response on global variable\n  transactions = response; // Populate user interface with records\n\n  Object(_dom__WEBPACK_IMPORTED_MODULE_0__[\"populateTotal\"])(transactions);\n  Object(_dom__WEBPACK_IMPORTED_MODULE_0__[\"populateTable\"])(transactions);\n  Object(_chart__WEBPACK_IMPORTED_MODULE_1__[\"populateChart\"])(transactions);\n}); // Post the transaction to the database\n\nfunction sendTransaction(isAdding) {\n  var nameEl = document.querySelector(\"#t-name\");\n  var amountEl = document.querySelector(\"#t-amount\");\n  var errorEl = document.querySelector(\".form .error\"); // Validate form\n\n  if (nameEl.value === \"\" || amountEl.value === \"\") {\n    errorEl.textContent = \"Missing Information\";\n    return;\n  } else {\n    errorEl.textContent = \"\";\n  } // Create record\n\n\n  var transaction = {\n    name: nameEl.value,\n    value: amountEl.value,\n    date: new Date().toISOString()\n  }; // If subtracting funds, convert amount to negative number\n\n  if (!isAdding) {\n    transaction.value *= -1;\n  } // Add to beginning of current array of data\n\n\n  transactions.unshift(transaction); // Populate user interface with new record\n\n  Object(_chart__WEBPACK_IMPORTED_MODULE_1__[\"populateChart\"])(transactions);\n  Object(_dom__WEBPACK_IMPORTED_MODULE_0__[\"populateTable\"])(transactions);\n  Object(_dom__WEBPACK_IMPORTED_MODULE_0__[\"populateTotal\"])(transactions); // Post transaction to to database\n\n  fetch(\"/api/transaction\", {\n    method: \"POST\",\n    body: JSON.stringify(transaction),\n    headers: {\n      Accept: \"application/json, text/plain, */*\",\n      \"Content-Type\": \"application/json\"\n    }\n  }).then(function (response) {\n    return response.json();\n  }).then(function (response) {\n    if (response.errors) {\n      errorEl.textContent = \"Missing Information\";\n    } else {\n      // Clear form\n      nameEl.value = \"\";\n      amountEl.value = \"\";\n    }\n  })[\"catch\"](function (err) {\n    // Fetch failed, so save in the indexed (local) db\n    Object(_db__WEBPACK_IMPORTED_MODULE_2__[\"saveRecord\"])(transaction); // Clear form\n\n    nameEl.value = \"\";\n    amountEl.value = \"\";\n  });\n} // Register the click even on the add and submit buttons\n\n\ndocument.querySelector(\"#add-btn\").onclick = function () {\n  sendTransaction(true);\n};\n\ndocument.querySelector(\"#sub-btn\").onclick = function () {\n  sendTransaction(false);\n};\n\n//# sourceURL=webpack:///./public/src/app.js?");

/***/ }),

/***/ "./public/src/chart.js":
/*!*****************************!*\
  !*** ./public/src/chart.js ***!
  \*****************************/
/*! exports provided: populateChart */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"populateChart\", function() { return populateChart; });\n//\n//  Functions to render a chart\n//\nvar myChart; //\n\nfunction populateChart(transactions) {\n  // copy array and reverse it\n  var reversed = transactions.slice().reverse();\n  var sum = 0; // create date labels for chart\n\n  var labels = reversed.map(function (t) {\n    var date = new Date(t.date);\n    return \"\".concat(date.getMonth() + 1, \"/\").concat(date.getDate(), \"/\").concat(date.getFullYear());\n  }); // create incremental values for chart\n\n  var data = reversed.map(function (t) {\n    sum += parseInt(t.value);\n    return sum;\n  }); // remove old chart if it exists\n\n  if (myChart) {\n    myChart.destroy();\n  }\n\n  var ctx = document.getElementById(\"myChart\").getContext(\"2d\");\n  myChart = new Chart(ctx, {\n    type: \"line\",\n    data: {\n      labels: labels,\n      datasets: [{\n        label: \"Total Over Time\",\n        fill: true,\n        backgroundColor: \"#6666ff\",\n        data: data\n      }]\n    }\n  });\n}\n\n//# sourceURL=webpack:///./public/src/chart.js?");

/***/ }),

/***/ "./public/src/db.js":
/*!**************************!*\
  !*** ./public/src/db.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("//\n//  Functions to manage the local database\n//\nvar db;\nvar budgetVersion; // Create a new db request for the budget database\n\nvar request = indexedDB.open(\"budget\", budgetVersion || 21);\n\nrequest.onupgradeneeded = function (e) {\n  console.log(\"Upgrade needed in local database\");\n  var oldVersion = e.oldVersion;\n  var newVersion = e.newVersion || db.version;\n  console.log(\"DB Updated from version \".concat(oldVersion, \" to \").concat(newVersion));\n  db = e.target.result; // If it does not exist, create the \"transactions\" storage\n\n  if (db.objectStoreNames.length === 0) {\n    db.createObjectStore(\"transactions\", {\n      autoIncrement: true\n    });\n  }\n}; // Display error messages\n\n\nrequest.onerror = function (error) {\n  console.log(\"Error: \".concat(error.target.errorCode));\n}; // Post the indexed (local) database records in bulk to the main database\n\n\nfunction checkDatabase() {\n  console.log(\"Check database invoked\"); // Open a connection to the transactions storage in read/write mode\n\n  var transaction = db.transaction([\"transactions\"], \"readwrite\"); // Assign the current store to a variable\n\n  var store = transaction.objectStore(\"transactions\"); // Get all records from storage and set to a variable\n\n  var getAll = store.getAll(); // If the request was successful\n\n  getAll.onsuccess = function () {\n    // If there are items in storage, try to add them in bulk when the connection is back online\n    if (getAll.result.length > 0) {\n      fetch(\"/api/transaction/bulk\", {\n        method: \"POST\",\n        body: JSON.stringify(getAll.result),\n        headers: {\n          Accept: \"application/json, text/plain, */*\",\n          \"Content-Type\": \"application/json\"\n        }\n      }).then(function (response) {\n        return response.json();\n      }).then(function (response) {\n        // If the response is not empty\n        if (response.length !== 0) {\n          // Open another connection to the transactions storage in read/write mode\n          transaction = db.transaction([\"transactions\"], \"readwrite\"); // Assign the current store to a variable\n\n          var currentStore = transaction.objectStore(\"transactions\"); // Clear existing entries because the bulk add was successful\n\n          currentStore.clear();\n          console.log(\"Clearing store...\");\n        }\n      });\n    }\n  };\n} // Check if the application is online before writing records from the local database to the main database\n\n\nrequest.onsuccess = function (e) {\n  console.log(\"Success\");\n  db = e.target.result;\n\n  if (navigator.onLine) {\n    console.log(\"Backend online!\");\n    checkDatabase();\n  }\n}; // Write a transactions to the local database\n\n\nvar saveRecord = function saveRecord(record) {\n  console.log(\"Save record invoked\"); // Open a connection to the transactions storage in read/write mode\n\n  var transaction = db.transaction([\"transactions\"], \"readwrite\"); // Assign the current store to a variable\n\n  var store = transaction.objectStore(\"transactions\"); // Add record to the transactions storage\n\n  store.add(record);\n}; // Listen for application coming back online\n\n\nwindow.addEventListener(\"online\", checkDatabase);\n\n//# sourceURL=webpack:///./public/src/db.js?");

/***/ }),

/***/ "./public/src/dom.js":
/*!***************************!*\
  !*** ./public/src/dom.js ***!
  \***************************/
/*! exports provided: populateTable, populateTotal */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"populateTable\", function() { return populateTable; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"populateTotal\", function() { return populateTotal; });\n//\n//  Functions to render HTML elements\n//\nfunction populateTable(transactions) {\n  var tbody = document.querySelector(\"#tbody\");\n  tbody.innerHTML = \"\";\n  transactions.forEach(function (transaction) {\n    // Create and populate a table row\n    var tr = document.createElement(\"tr\");\n    tr.innerHTML = \"\\n        <td>\".concat(transaction.name, \"</td>\\n        <td>\").concat(transaction.value, \"</td>\\n      \");\n    tbody.appendChild(tr);\n  });\n}\nfunction populateTotal(transactions) {\n  // Reduce transaction amounts to a single total value\n  var total = transactions.reduce(function (total, t) {\n    return total + parseInt(t.value);\n  }, 0);\n  var totalEl = document.querySelector(\"#total\");\n  totalEl.textContent = total;\n}\n\n//# sourceURL=webpack:///./public/src/dom.js?");

/***/ })

/******/ });