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
    .then((dbTransaction) => {
      res.json(dbTransaction);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});
//
//  Handles inserting a transaction to the database
//
router.post("/api/transaction/bulk", ({ body }, res) => {
  Transaction.insertMany(body)
    .then((dbTransaction) => {
      res.json(dbTransaction);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});
//
//  Handles retrieven all transactions from the database
//
router.get("/api/transaction", (req, res) => {
  Transaction.find({})
    .sort({ date: -1 })
    .then((dbTransaction) => {
      res.json(dbTransaction);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

module.exports = router;
