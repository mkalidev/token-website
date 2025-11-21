# Token Website

A modern React-based web application for viewing ERC20 token details and interacting with smart contracts on the Ethereum blockchain.

## Contract Information

- **Contract Address**: `0x8909332Dd684c572703F9158039788a3057D0C40`
- **Token**: Finnacle Token
- **ABI**: Full contract ABI is implemented and available in the application

## Features

- 🔗 **Wallet Connection**: Connect your wallet using Reown (WalletConnect) - supports MetaMask, WalletConnect, Coinbase Wallet, and more
- 📊 **Token Details**: Automatically displays comprehensive token information when wallet is connected:
  - Token name and symbol
  - Decimals
  - Total supply
  - Contract address
- 📖 **Read Functions**: Automatically fetches and displays all read-only contract functions when wallet connects
- ✍️ **Write Functions**: Interactive section to execute contract write functions with parameter inputs
- 🎨 **Modern UI**: Beautiful dark-themed interface built with Tailwind CSS

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and development server
- **Ethers.js v6** - Ethereum library for blockchain interactions
- **Reown AppKit (WalletConnect)** - Multi-wallet connection solution
- **Wagmi** - React Hooks for Ethereum
- **TanStack Query** - Data fetching and state management
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing

## Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn package manager
- Web3 wallet (MetaMask, WalletConnect, Coinbase Wallet, or any wallet supported by Reown)

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
   - Select your preferred wallet from the Reown modal (supports MetaMask, WalletConnect, Coinbase Wallet, and more)
   - Approve the connection request
   - Your wallet address will be displayed once connected
   - The Finnacle Token contract is automatically loaded when you connect

2. **View Token Details**:
   - Token basic information (name, symbol, decimals, total supply) is automatically displayed when wallet connects
   - Contract address is shown for reference

3. **Read Contract Functions**:
   - All read-only functions are automatically fetched and displayed when wallet connects
   - Results are shown in a grid layout
   - Click "Refresh" to reload the data

4. **Interact with Write Functions**:
   - Select a write function from the dropdown
   - Enter the required parameters
   - Click "Execute" to send the transaction
   - Review transaction details in your wallet before confirming

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

### Reown AppKit Setup

To use the wallet connection feature, you need to:

1. Get a Project ID from [Reown Dashboard](https://dashboard.reown.com)
2. Set it as an environment variable:
   ```bash
   VITE_REOWN_PROJECT_ID=your_project_id_here
   ```
   Or update it directly in `src/providers/AppKitProvider.jsx`

### Supported Networks

- Ethereum Mainnet
- Arbitrum
- Base
- Celo

## Browser Support

- Chrome/Edge
- Firefox
- Brave
- Safari
- Other modern browsers with Web3 wallet support

## Security Notes

- Always verify contract addresses before interacting with them
- Never share your private keys or seed phrases
- This application requires explicit user approval for all transactions
- Review all transaction details in your wallet before confirming
- The contract address `0x8909332Dd684c572703F9158039788a3057D0C40` is pre-configured for the Finnacle Token

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Add your license here]

## Support

For issues and questions, please open an issue on the repository.

