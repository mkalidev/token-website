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
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Finnacle Token Dashboard
          </h1>
          <p className="text-gray-400">
            Connect your wallet to view token details and interact with the contract
          </p>
        </header>

        <WalletConnection 
          account={account}
          setAccount={setAccount}
          setProvider={setProvider}
        />

        {account && provider && contractAddress ? (
          <div className="mt-6 space-y-6">
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
          <div className="mt-6 bg-dark-surface rounded-lg p-8 border border-dark-border text-center">
            <p className="text-gray-400">
              Please connect your wallet to view contract details and interact with functions
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

