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
  const getPublicRpcUrl = (networkChainId) => {
    const targetChainId = networkChainId || chainId || 8453 // Default to Base
    switch (targetChainId) {
      case 1: // Mainnet
        return 'https://eth.llamarpc.com'
      case 42161: // Arbitrum
        return 'https://arb1.arbitrum.io/rpc'
      case 8453: // Base
        return 'https://mainnet.base.org'
      case 42220: // Celo
        return 'https://forno.celo.org'
      default:
        return 'https://mainnet.base.org' // Default to Base
    }
  }

  // Try to find which network the contract exists on - check Base first
  const findContractNetwork = async (address) => {
    const networks = [
      { id: 8453, name: 'Base' }, // Check Base first since it's the default
      { id: 1, name: 'Ethereum Mainnet' },
      { id: 42161, name: 'Arbitrum' },
      { id: 42220, name: 'Celo' },
    ]

    for (const network of networks) {
      try {
        const rpcUrl = getPublicRpcUrl(network.id)
        const provider = new ethers.JsonRpcProvider(rpcUrl)
        const code = await provider.getCode(address)
        if (code && code !== '0x') {
          return network
        }
      } catch (err) {
        continue
      }
    }
    return null
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
      // First, try to find which network the contract is on
      const contractNetwork = await findContractNetwork(tokenAddress)
      const targetChainId = contractNetwork?.id || chainId || 8453 // Default to Base
      
      // Use public RPC provider for read operations
      const rpcUrl = getPublicRpcUrl(targetChainId)
      console.log('TokenDetails - Using RPC URL:', rpcUrl, 'for chain:', targetChainId, contractNetwork ? `(Found on ${contractNetwork.name})` : '')
      const publicProvider = new ethers.JsonRpcProvider(rpcUrl)
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, publicProvider)
      console.log('TokenDetails - Contract initialized:', tokenAddress)
      
      // Get decimals first with fallback - suppress decode errors
      let decimals = 18
      try {
        const decimalsResult = await contract.decimals()
        if (decimalsResult !== null && decimalsResult !== undefined) {
          decimals = Number(decimalsResult)
        }
      } catch (err) {
        // Silently use default 18 if decimals fails (common for contracts not on this network)
        if (!err.message?.includes('could not decode') && !err.message?.includes('BAD_DATA')) {
          console.warn('Could not fetch decimals:', err.message)
        }
      }

      // Try to fetch token info with better error handling
      let name = 'N/A'
      let symbol = 'N/A'
      let totalSupply = ethers.parseUnits('0', decimals)

      try {
        const results = await Promise.allSettled([
          contract.name(),
          contract.symbol(),
          contract.totalSupply(),
        ])

        if (results[0].status === 'fulfilled') {
          name = results[0].value
        }
        if (results[1].status === 'fulfilled') {
          symbol = results[1].value
        }
        if (results[2].status === 'fulfilled') {
          totalSupply = results[2].value
        }

        // If all calls failed, the contract might not exist on this network
        if (name === 'N/A' && symbol === 'N/A' && totalSupply === ethers.parseUnits('0', decimals)) {
          setError('Contract not found on this network. Please check the network or contract address.')
          setLoading(false)
          return
        }
      } catch (err) {
        console.error('Error fetching token info:', err)
        setError('Failed to fetch token details. The contract may not exist on this network.')
        setLoading(false)
        return
      }

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

