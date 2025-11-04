# 🏦 BlockBank – Blockchain Frontend

![Project Banner](https://img.shields.io/badge/Frontend-Blockchain-blue?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Tech-React%20%7C%20TailwindCSS%20%7C%20Vite%20%7C%20Web3.js-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

## 🚀 Overview
**BlockBank** is a decentralized banking application built on blockchain technology. This repository contains the **frontend** of the platform, designed to interact with Ethereum smart contracts and offer a modern, secure, and responsive user experience.

The project simulates the behavior of a **digital savings bank** where users can:
- Create blockchain-based accounts.
- Deposit and withdraw cryptocurrency (ETH).
- View balance updates in real time.
- Interact directly with smart contracts through MetaMask.

---

## 🧠 Core Features
- 🏦 **Decentralized Banking:** Connects directly with Ethereum blockchain.
- 💳 **Wallet Integration:** Seamless MetaMask authentication.
- 💸 **Real-Time Transactions:** Instant deposits, withdrawals, and balance display.
- 🖥️ **Modern UI/UX:** Built using React + TailwindCSS with responsive design.
- ⚙️ **Smart Contract Interaction:** Powered by Web3.js for communication with Solidity backend.

---

## 🛠️ Tech Stack
| Layer | Technology |
|:------|:------------|
| Frontend Framework | React + Vite |
| Styling | Tailwind CSS |
| Blockchain Connection | Web3.js |
| Wallet Integration | MetaMask |
| Backend Smart Contracts | Solidity (Deployed on Ganache/Testnet) |

---

## 📂 Folder Structure
```
blockbank-blockchain-frontend/
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Main page views
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Helper and config functions
│   ├── App.jsx            # Main App component
│   └── main.jsx           # Entry point with React DOM
├── package.json
└── tailwind.config.js
```

---

## ⚡ Getting Started
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/ManuCodello/BlockBank-blockchain-frontend.git
cd BlockBank-blockchain-frontend
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Start the Development Server
```bash
npm run dev
```

### 4️⃣ Connect MetaMask
Make sure MetaMask is installed and configured to connect with your local blockchain (e.g., **Ganache** or **Sepolia Testnet**).

---

## 🔗 Smart Contract Integration
To interact with the backend smart contracts:
- Ensure your blockchain network is running (e.g., Ganache CLI or local Hardhat node).
- Deploy your Solidity contracts.
- Update contract ABI and address in `/src/utils/contractConfig.js`.

Example configuration:
```javascript
export const contractAddress = "0x123...abc";
export const contractABI = [ /* ABI JSON */ ];
```

---

## 🎨 UI Showcase
| Feature | Screenshot |
|:--------:|:-----------:|
| Dashboard | ![Dashboard](https://via.placeholder.com/600x300.png?text=Dashboard+Preview) |
| Wallet Connection | ![Wallet](https://via.placeholder.com/600x300.png?text=Wallet+Connection) |

---

## 🧩 Future Improvements
- ✅ Multi-token support (ERC-20, ERC-721)
- ✅ Transaction history with blockchain explorer integration
- ✅ Integration with backend for user analytics
- ✅ Deploy smart contracts to Ethereum mainnet

---

## 👨‍💻 Author
**Developed by [Manu Codello](https://github.com/ManuCodello)**  
💡 Passionate about Blockchain, AI, and Full-Stack Development.

---

## 📜 License
This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for more information.

---

## 🌐 Connect
[![GitHub](https://img.shields.io/badge/GitHub-ManuCodello-black?style=flat&logo=github)](https://github.com/ManuCodello)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-ManuCodello-blue?style=flat&logo=linkedin)](https://linkedin.com/in/manucodello)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-success?style=flat&logo=vercel)](#)
