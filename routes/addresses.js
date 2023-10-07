const express = require("express");
const router = express.Router();
const axios = require("axios");
const Address = require("../models/Address");
const Transaction = require("../models/Transaction");
const { LIMIT } = require("../constants");

/**
 * @swagger
 * /addresses:
 *  get:
 *      description: Get all Bitcoin addresses
 *      responses:
 *          '200':
 *              description: A list of Bitcoin addresses
 */
router.get("/", async (req, res) => {
  try {
    const addresses = await Address.find({});
    res.send(addresses.map((addrDoc) => addrDoc.address));
  } catch (err) {
    res.status(500).send(err);
  }
});

/**
 * @swagger
 * /addresses:
 *  post:
 *    summary: Add a Bitcoin address
 *    description: Add a Bitcoin address to the database.
 *    requestBody:
 *      description: Bitcoin Address to be added
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              address:
 *                type: string
 *                description: The Bitcoin address string.
 *                example: "3E8ociqZa9mZUSwGdSmAEMAoAxBK3FNDcd"
 *            required:
 *              - address
 *    responses:
 *      '200':
 *        description: Successfully added the Bitcoin address.
 */
router.post("/", async (req, res) => {
  const address = req.body.address;
  const newAddress = new Address({ address });

  try {
    await newAddress.save();
    res.send({ address: req.body.address });
  } catch (err) {
    res.status(500).send(err);
  }
});

/**
 * @swagger
 * /addresses/{address}:
 *  delete:
 *      description: Remove a Bitcoin address
 *      parameters:
 *          - in: path
 *            name: address
 *            required: true
 *            type: string
 *            description: The Bitcoin address to delete
 *      responses:
 *          '200':
 *              description: Removed a Bitcoin address
 */
router.delete("/:address", async (req, res) => {
  const address = req.params.address;

  try {
    await Address.deleteOne({ address: address });
    res.send({ deleted: true });
  } catch (err) {
    res.status(500).send(err);
  }
});

/**
 * @swagger
 * /addresses/{address}/sync:
 *  post:
 *      description: Synchronize a Bitcoin address
 *      parameters:
 *          - in: path
 *            name: address
 *            required: true
 *            type: string
 *            description: The Bitcoin address to synchronize
 *          - in: query
 *            name: limit
 *            type: number
 *            description: Limit for transactions to fetch
 *          - in: query
 *            name: offset
 *            type: number
 *            description: Offset for transactions
 *      responses:
 *          '200':
 *              description: Synchronized the address
 */
router.post("/:address/sync", async (req, res) => {
  const address = req.params.address;
  const limit = Number(req.query.limit) || LIMIT;
  const offset = Number(req.query.offset) || 0;

  try {
    const response = await axios.get(
      `https://blockchain.info/rawaddr/${address}?limit=${limit}&offset=${offset}`
    );
    const transactions = response.data.txs;

    const transactionPromises = transactions.map((tx) => {
      const newTransaction = new Transaction({
        address,
        transaction_hash: tx.hash,
        transaction_time: tx.time,
        balance: tx.balance,
      });
      return newTransaction.save();
    });

    await Promise.all(transactionPromises);
    res.json({ synced: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /addresses/{address}/transactions:
 *  get:
 *      description: Get transactions for a Bitcoin address
 *      parameters:
 *          - in: path
 *            name: address
 *            required: true
 *            type: string
 *            description: The Bitcoin address to retrieve transactions for
 *      responses:
 *          '200':
 *              description: A list of transactions for the Bitcoin address
 */
router.get("/:address/transactions", async (req, res) => {
  const address = req.params.address;

  try {
    const transactions = await Transaction.find({ address: address });
    res.send(transactions);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
