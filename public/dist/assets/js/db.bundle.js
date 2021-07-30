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
/******/ 	return __webpack_require__(__webpack_require__.s = "./public/src/db.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./public/src/db.js":
/*!**************************!*\
  !*** ./public/src/db.js ***!
  \**************************/
/*! exports provided: saveRecord */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"saveRecord\", function() { return saveRecord; });\n//\n//  Functions to manage the local database\n//\nvar db;\nvar budgetVersion; // Create a new db request for the budget database\n\nvar request = indexedDB.open(\"budget\", budgetVersion || 21);\n\nrequest.onupgradeneeded = function (e) {\n  console.log(\"Upgrade needed in local database\");\n  var oldVersion = e.oldVersion;\n  var newVersion = e.newVersion || db.version;\n  console.log(\"DB Updated from version \".concat(oldVersion, \" to \").concat(newVersion));\n  db = e.target.result; // If it does not exist, create the \"transactions\" storage\n\n  if (db.objectStoreNames.length === 0) {\n    db.createObjectStore(\"transactions\", {\n      autoIncrement: true\n    });\n  }\n}; // Display error messages\n\n\nrequest.onerror = function (error) {\n  console.log(\"Error: \".concat(error.target.errorCode));\n}; // Post the indexed (local) database records in bulk to the main database\n\n\nfunction checkDatabase() {\n  console.log(\"Check database invoked\"); // Open a connection to the transactions storage in read/write mode\n\n  var transaction = db.transaction([\"transactions\"], \"readwrite\"); // Assign the current store to a variable\n\n  var store = transaction.objectStore(\"transactions\"); // Get all records from storage and set to a variable\n\n  var getAll = store.getAll(); // If the request was successful\n\n  getAll.onsuccess = function () {\n    // If there are items in storage, try to add them in bulk when the connection is back online\n    if (getAll.result.length > 0) {\n      fetch(\"/api/transaction/bulk\", {\n        method: \"POST\",\n        body: JSON.stringify(getAll.result),\n        headers: {\n          Accept: \"application/json, text/plain, */*\",\n          \"Content-Type\": \"application/json\"\n        }\n      }).then(function (response) {\n        return response.json();\n      }).then(function (response) {\n        // If the response is not empty\n        if (response.length !== 0) {\n          // Open another connection to the transactions storage in read/write mode\n          transaction = db.transaction([\"transactions\"], \"readwrite\"); // Assign the current store to a variable\n\n          var currentStore = transaction.objectStore(\"transactions\"); // Clear existing entries because the bulk add was successful\n\n          currentStore.clear();\n          console.log(\"Clearing store...\");\n        }\n      });\n    }\n  };\n} // Check if the application is online before writing records from the local database to the main database\n\n\nrequest.onsuccess = function (e) {\n  console.log(\"Success\");\n  db = e.target.result;\n\n  if (navigator.onLine) {\n    console.log(\"Backend online!\");\n    checkDatabase();\n  }\n}; // Write a transactions to the local database\n\n\nvar saveRecord = function saveRecord(record) {\n  console.log(\"Save record invoked\"); // Open a connection to the transactions storage in read/write mode\n\n  var transaction = db.transaction([\"transactions\"], \"readwrite\"); // Assign the current store to a variable\n\n  var store = transaction.objectStore(\"transactions\"); // Add record to the transactions storage\n\n  store.add(record);\n}; // Listen for application coming back online\n\nwindow.addEventListener(\"online\", checkDatabase);\n\n//# sourceURL=webpack:///./public/src/db.js?");

/***/ })

/******/ });