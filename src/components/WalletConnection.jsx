import { useState } from 'react'

const WalletConnection = ({ account, setAccount, setProvider }) => {
  const [isConnecting, setIsConnecting] = useState(false)

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setIsConnecting(true)
        const provider = window.ethereum
        const accounts = await provider.request({ method: 'eth_requestAccounts' })
        setAccount(accounts[0])
        
        // Create ethers provider
        const { ethers } = await import('ethers')
        const ethersProvider = new ethers.BrowserProvider(provider)
        setProvider(ethersProvider)
      } catch (error) {
        console.error('Error connecting wallet:', error)
        alert('Failed to connect wallet. Please make sure MetaMask is installed.')
      } finally {
        setIsConnecting(false)
      }
    } else {
      alert('Please install MetaMask or another Web3 wallet to continue.')
    }
  }

  const disconnectWallet = () => {
    setAccount(null)
    setProvider(null)
  }

  return (
    <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">
            Wallet Connection
          </h3>
          {account ? (
            <p className="text-sm text-gray-400">
              Connected: <span className="text-blue-400 font-mono">{account.slice(0, 6)}...{account.slice(-4)}</span>
            </p>
          ) : (
            <p className="text-sm text-gray-400">
              Connect your wallet to interact with contracts
            </p>
          )}
        </div>
        {account ? (
          <button
            onClick={disconnectWallet}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
      </div>
    </div>
  )
}

export default WalletConnection

