import { useState, useEffect } from 'react'
import TokenDetails from './components/TokenDetails'
import ContractInteraction from './components/ContractInteraction'
import WalletConnection from './components/WalletConnection'
import { FINNACLE_TOKEN_ADDRESS } from './constants/finnacleABI'

function App() {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [tokenAddress, setTokenAddress] = useState('')
  const [contractAddress, setContractAddress] = useState('')

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Token Details & Contract Interaction
          </h1>
          <p className="text-gray-400">
            View token information and interact with smart contracts
          </p>
        </header>

        <WalletConnection 
          account={account}
          setAccount={setAccount}
          setProvider={setProvider}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Token Configuration
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Token Address
                  </label>
                  <button
                    onClick={() => setTokenAddress(FINNACLE_TOKEN_ADDRESS)}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-medium transition-colors"
                  >
                    Load Finnacle
                  </button>
                </div>
                <input
                  type="text"
                  value={tokenAddress}
                  onChange={(e) => setTokenAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Contract Address
                  </label>
                  <button
                    onClick={() => setContractAddress(FINNACLE_TOKEN_ADDRESS)}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-medium transition-colors"
                  >
                    Load Finnacle
                  </button>
                </div>
                <input
                  type="text"
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {tokenAddress && (
            <TokenDetails 
              tokenAddress={tokenAddress}
              provider={provider}
            />
          )}

          {contractAddress && account && (
            <ContractInteraction 
              contractAddress={contractAddress}
              account={account}
              provider={provider}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default App

