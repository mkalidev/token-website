import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useChainId } from 'wagmi'

// Standard ERC20 ABI (minimal)
const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
]

const TokenDetails = ({ tokenAddress, provider }) => {
  const [tokenInfo, setTokenInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const chainId = useChainId()

  // Get public RPC URL based on chain
  const getPublicRpcUrl = () => {
    switch (chainId) {
      case 1: // Mainnet
        return 'https://eth.llamarpc.com'
      case 42161: // Arbitrum
        return 'https://arb1.arbitrum.io/rpc'
      case 8453: // Base
        return 'https://mainnet.base.org'
      case 42220: // Celo
        return 'https://forno.celo.org'
      default:
        return 'https://eth.llamarpc.com' // Default to mainnet
    }
  }

  useEffect(() => {
    if (tokenAddress) {
      fetchTokenDetails()
    }
  }, [tokenAddress, chainId])

  const fetchTokenDetails = async () => {
    if (!tokenAddress) return

    setLoading(true)
    setError(null)

    try {
      // Use public RPC provider for read operations
      const rpcUrl = getPublicRpcUrl()
      console.log('TokenDetails - Using RPC URL:', rpcUrl, 'for chain:', chainId)
      const publicProvider = new ethers.JsonRpcProvider(rpcUrl)
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, publicProvider)
      console.log('TokenDetails - Contract initialized:', tokenAddress)
      
      // Get decimals first with fallback
      let decimals = 18
      try {
        const decimalsResult = await contract.decimals()
        decimals = Number(decimalsResult)
      } catch (err) {
        console.warn('Could not fetch decimals, using default 18:', err)
        // Use default 18 if decimals fails
      }

      const [name, symbol, totalSupply] = await Promise.all([
        contract.name().catch(() => 'N/A'),
        contract.symbol().catch(() => 'N/A'),
        contract.totalSupply().catch(() => ethers.parseUnits('0', decimals)),
      ])

      setTokenInfo({
        name,
        symbol,
        decimals: decimals,
        totalSupply: ethers.formatUnits(totalSupply, decimals),
        address: tokenAddress,
      })
    } catch (err) {
      console.error('Error fetching token details:', err)
      setError('Failed to fetch token details. Please check the address.')
    } finally {
      setLoading(false)
    }
  }

  if (!tokenAddress) return null

  return (
    <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-white">Token Details</h2>
        <button
          onClick={fetchTokenDetails}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {loading && !tokenInfo ? (
        <div className="text-center py-8 text-gray-400">Loading token details...</div>
      ) : tokenInfo ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Name</p>
              <p className="text-white font-medium">{tokenInfo.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Symbol</p>
              <p className="text-white font-medium">{tokenInfo.symbol}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Decimals</p>
              <p className="text-white font-medium">{tokenInfo.decimals}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Supply</p>
              <p className="text-white font-medium break-all">
                {Number(tokenInfo.totalSupply).toLocaleString()}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Contract Address</p>
            <p className="text-blue-400 font-mono text-sm break-all">
              {tokenInfo.address}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          Enter a token address and connect wallet to view details
        </div>
      )}
    </div>
  )
}

export default TokenDetails

