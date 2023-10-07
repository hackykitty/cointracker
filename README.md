# CoinTracker Backend

A backend solution for tracking Bitcoin addresses and their transactions.

## Prerequisites

- Node.js
- MongoDB

## Installation & Setup

1. Clone the repository:

```bash
git clone https://github.com/hackykitty/cointracker
cd cointracker
```

2. Install the required npm packages:

```bash
npm install
```

3. Ensure MongoDB is running on your system.

4. Start the server:

```bash
npm run start
```

The server will be running at `http://localhost:8080/`.

## Usage

### API Endpoints

- **GET** `/addresses`: Retrieve all Bitcoin addresses
- **POST** `/addresses`: Add a Bitcoin address. Send the address in the body as JSON: `{ "address": "YOUR_BITCOIN_ADDRESS" }`
- **DELETE** `/addresses/{address}`: Remove a Bitcoin address
- **POST** `/addresses/{address}/sync`: Synchronize a Bitcoin address. Optional query parameters: `limit` and `offset`
- **GET** `/addresses/{address}/transactions`: Get transactions for a Bitcoin address

### API Documentation

For detailed API documentation and to test endpoints directly from your browser, navigate to:

```
http://localhost:8080/api-docs
```

### Background Synchronization

The system is set up to synchronize all addresses every hour using `node-cron`. During synchronization, the server fetches the latest transactions for each Bitcoin address and stores them in the database. Synchronization uses offsets to handle large numbers of transactions efficiently.

## Directory Structure

- `server.js`: Main server setup and initialization
- `models/`: Contains all database model definitions
  - `Address.js`: Schema and model for Bitcoin addresses
  - `Transaction.js`: Schema and model for Bitcoin transactions
  - `SyncState.js`: Schema and model for tracking synchronization state
- `routes/`: Contains API route handlers
  - `addresses.js`: Route handlers related to Bitcoin addresses

## Assumptions

- Only supports Bitcoin addresses.
- Uses the Blockchain.com API for fetching address data.
- Handles synchronization in chunks to accommodate addresses with a large number of transactions.

## Contributing

Feel free to fork the project, make enhancements, and create pull requests. Your contributions are welcome!