# TokenMaster: NFT Event Ticketing Platform

TokenMaster is a decentralized application (dApp) for creating, selling, and managing event tickets as NFTs on the Ethereum blockchain. It features a modern React frontend, a robust smart contract backend, and seamless blockchain integration.

## Features

- **Event Creation:** Organizers can create events with details like name, date, location, ticket price, and more.
- **NFT Tickets:** Each ticket is minted as an ERC721 NFT, ensuring authenticity and uniqueness.
- **Ticket Marketplace:** Users can buy, sell, and transfer tickets securely.
- **Seat Management:** Assign and track seats for each event.
- **Refunds & Cancellations:** Users can cancel tickets for a partial refund.
- **Modern UI:** Built with React, Vite, TailwindCSS, and AOS for smooth animations.

## Tech Stack

- **Smart Contracts:** Solidity, OpenZeppelin ERC721, Hardhat
- **Frontend:** React, Vite, TailwindCSS, ethers.js, React Router
- **Testing:** Hardhat, Chai

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MetaMask or compatible Ethereum wallet

### Installation

#### 1. Clone the repository

```bash
git clone <repo-url>
cd MT
```

#### 2. Install dependencies

- **Root (for contracts):**
  ```bash
  npm install
  ```

- **Frontend:**
  ```bash
  cd frontend
  npm install
  ```

#### 3. Compile and Deploy Smart Contracts

```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network <network>
```

#### 4. Run the Frontend

```bash
cd frontend
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to view the app.

## Project Structure
