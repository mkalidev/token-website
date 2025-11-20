# Token Website

A modern React-based web application for viewing ERC20 token details and interacting with smart contracts on the Ethereum blockchain.

## Features

- 🔗 **Wallet Connection**: Connect your MetaMask or other Web3 wallet to interact with the blockchain
- 📊 **Token Details**: View comprehensive information about any ERC20 token including:
  - Token name and symbol
  - Decimals
  - Total supply
  - Contract address
- 🔄 **Contract Interaction**: Interact with smart contracts (coming soon)
- 🎨 **Modern UI**: Beautiful dark-themed interface built with Tailwind CSS

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and development server
- **Ethers.js v6** - Ethereum library for blockchain interactions
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing

## Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn package manager
- MetaMask or another Web3 wallet browser extension

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd token-website
```

2. Install dependencies:
```bash
npm install
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

## Building for Production

Build the application for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Usage

1. **Connect Your Wallet**:
   - Click the "Connect Wallet" button
   - Approve the connection request in your MetaMask extension
   - Your wallet address will be displayed once connected

2. **View Token Details**:
   - Enter an ERC20 token contract address in the "Token Address" field
   - The token information will automatically load and display:
     - Name, symbol, decimals, and total supply
     - Full contract address

3. **Interact with Contracts**:
   - Enter a smart contract address in the "Contract Address" field
   - Connect your wallet to enable contract interactions
   - (Contract interaction features are in development)

## Project Structure

```
token-website/
├── src/
│   ├── components/
│   │   ├── WalletConnection.jsx    # Wallet connection component
│   │   └── TokenDetails.jsx        # Token information display
│   ├── App.jsx                     # Main application component
│   ├── main.jsx                    # Application entry point
│   └── index.css                   # Global styles
├── index.html                      # HTML template
├── package.json                    # Dependencies and scripts
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS configuration
└── postcss.config.js               # PostCSS configuration
```

## Configuration

The application uses Tailwind CSS with a custom dark theme. You can customize the theme colors in `tailwind.config.js`.

## Browser Support

- Chrome/Edge (recommended for MetaMask)
- Firefox
- Brave
- Other Chromium-based browsers

## Security Notes

- Always verify contract addresses before interacting with them
- Never share your private keys or seed phrases
- This application only reads from the blockchain and requires explicit user approval for transactions
- Review all transaction details in MetaMask before confirming

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Add your license here]

## Support

For issues and questions, please open an issue on the repository.

