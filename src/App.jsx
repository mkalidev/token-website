import { useState, useEffect } from 'react'
import TokenDetails from './components/TokenDetails'
import ReadFunctions from './components/ReadFunctions'
import WriteFunctions from './components/WriteFunctions'
import WalletConnection from './components/WalletConnection'
import { FINNACLE_TOKEN_ADDRESS } from './constants/finnacleABI'

function App() {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [contractAddress, setContractAddress] = useState(FINNACLE_TOKEN_ADDRESS)

  // Auto-load Finnacle token when wallet connects
  useEffect(() => {
    if (account && provider) {
      setContractAddress(FINNACLE_TOKEN_ADDRESS)
    }
  }, [account, provider])

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-8" style={{ maxWidth: '1200px' }}>
        {/* Header */}
        <header className="mb-12 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-2xl shadow-blue-500/20">
            <span className="text-4xl">⚡</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Finnacle Token Dashboard
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Connect your wallet to view token details and interact with the contract
          </p>
        </header>

        {/* Wallet Connection */}
        <div className="animate-slide-up">
          <WalletConnection 
            account={account}
            setAccount={setAccount}
            setProvider={setProvider}
          />
        </div>

        {account && provider && contractAddress ? (
          <div className="mt-8 space-y-8 animate-fade-in">
            {/* Token Basic Details */}
            <TokenDetails 
              tokenAddress={contractAddress}
              provider={provider}
            />

            {/* Read Functions - Auto-displayed */}
            <ReadFunctions 
              contractAddress={contractAddress}
              provider={provider}
              account={account}
            />

            {/* Write Functions - Interactive Section */}
            <WriteFunctions 
              contractAddress={contractAddress}
              account={account}
              provider={provider}
            />
          </div>
        ) : (
          <div className="mt-8 glass rounded-2xl p-12 text-center animate-slide-up">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-dark-card mb-4">
              <span className="text-3xl">🔐</span>
            </div>
            <p className="text-gray-300 text-lg">
              Please connect your wallet to view contract details and interact with functions
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

