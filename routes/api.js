//
//  Import required libraries
//
const router = require("express").Router();
const Transaction = require("../models/transaction.js");
//
//  Handles inserting a transaction to the database
//
router.post("/api/transaction", ({ body }, res) => {
  Transaction.create(body)
    .then((transaction) => {
      res.json(transaction);
    })
    .catch((error) => {
      res.status(404).json(error);
    });
});
//
//  Handles inserting a transaction to the database
//
router.post("/api/transaction/bulk", ({ body }, res) => {
  Transaction.insertMany(body)
    .then((transaction) => {
      res.json(transaction);
    })
    .catch((error) => {
      res.status(404).json(error);
    });
});
//
//  Handles retrieven all transactions from the database
//
router.get("/api/transaction", (req, res) => {
  Transaction.find({})
    .sort({ date: -1 })
    .then((transaction) => {
      res.json(transaction);
    })
    .catch((error) => {
      res.status(404).json(error);
    });
});

module.exports = router;
