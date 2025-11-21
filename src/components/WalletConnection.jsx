import { useEffect } from 'react'
import { useAppKit } from '@reown/appkit/react'
import { useAccount, useWalletClient } from 'wagmi'
import { ethers } from 'ethers'

const WalletConnection = ({ account, setAccount, setProvider }) => {
  const { open, close } = useAppKit()
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()

  useEffect(() => {
    if (isConnected && address) {
      setAccount(address)
      
      // Convert wagmi wallet client to ethers provider
      if (walletClient) {
        // Use the wallet client's account to create an ethers provider
        // For read operations, we can use a public RPC, but for consistency use the connected wallet
        const ethersProvider = new ethers.BrowserProvider(walletClient.transport)
        setProvider(ethersProvider)
      } else {
        // Fallback: use window.ethereum if available
        if (typeof window !== 'undefined' && window.ethereum) {
          const ethersProvider = new ethers.BrowserProvider(window.ethereum)
          setProvider(ethersProvider)
        }
      }
    } else {
      setAccount(null)
      setProvider(null)
    }
  }, [isConnected, address, walletClient, setAccount, setProvider])

  const connectWallet = () => {
    open()
  }

  const disconnectWallet = () => {
    close()
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
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  )
}

export default WalletConnection

