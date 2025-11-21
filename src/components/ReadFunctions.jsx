import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { FINNACLE_TOKEN_ABI } from '../constants/finnacleABI'
import { useChainId } from 'wagmi'

const ReadFunctions = ({ contractAddress, provider, account }) => {
  const [readResults, setReadResults] = useState({})
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
    if (contractAddress) {
      fetchAllReadFunctions()
    }
  }, [contractAddress, account, chainId])

  const fetchAllReadFunctions = async () => {
    if (!contractAddress) return

    setLoading(true)
    setError(null)

    try {
      // Use public RPC provider for read operations to avoid project ID issues
      const rpcUrl = getPublicRpcUrl()
      const publicProvider = new ethers.JsonRpcProvider(rpcUrl)
      const contract = new ethers.Contract(contractAddress, FINNACLE_TOKEN_ABI, publicProvider)
      
      // Get all read functions from ABI
      const readFunctions = FINNACLE_TOKEN_ABI.filter(
        item => item.type === 'function' && (item.stateMutability === 'view' || item.stateMutability === 'pure')
      )

      const results = {}

      // Call each read function
      for (const func of readFunctions) {
        try {
          let result
          
          // Handle functions with parameters
          if (func.name === 'balanceOf' && account) {
            result = await contract.balanceOf(account)
            results[`${func.name}(${account.slice(0, 6)}...)`] = {
              value: ethers.formatUnits(result, 18),
              raw: result.toString(),
              type: 'uint256'
            }
          } else if (func.name === 'allowance' && account) {
            // For allowance, we need owner and spender - skip for now or use default
            continue
          } else if (func.inputs && func.inputs.length === 0) {
            // Functions with no parameters
            result = await contract[func.name]()
            
            // Format result based on return type
            if (func.outputs && func.outputs.length > 0) {
              const outputType = func.outputs[0].type
              if (outputType === 'uint256' || outputType === 'uint8') {
                if (func.name === 'decimals') {
                  results[func.name] = {
                    value: result.toString(),
                    raw: result.toString(),
                    type: outputType
                  }
                } else {
                  results[func.name] = {
                    value: ethers.formatUnits(result, func.name === 'totalSupply' ? 18 : 0),
                    raw: result.toString(),
                    type: outputType
                  }
                }
              } else if (outputType === 'string') {
                results[func.name] = {
                  value: result,
                  raw: result,
                  type: outputType
                }
              } else if (outputType === 'address') {
                results[func.name] = {
                  value: result,
                  raw: result,
                  type: outputType
                }
              } else {
                results[func.name] = {
                  value: result.toString(),
                  raw: result.toString(),
                  type: outputType
                }
              }
            }
          }
        } catch (err) {
          console.error(`Error calling ${func.name}:`, err)
          results[func.name] = {
            value: 'Error',
            error: err.message
          }
        }
      }

      setReadResults(results)
    } catch (err) {
      console.error('Error fetching read functions:', err)
      setError('Failed to fetch contract data. Please check the address.')
    } finally {
      setLoading(false)
    }
  }

  if (!contractAddress || !provider) return null

  return (
    <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-white">Contract Read Functions</h2>
        <button
          onClick={fetchAllReadFunctions}
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

      {loading && Object.keys(readResults).length === 0 ? (
        <div className="text-center py-8 text-gray-400">Loading contract data...</div>
      ) : Object.keys(readResults).length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(readResults).map(([key, data]) => (
              <div key={key} className="bg-dark-card rounded-lg p-4 border border-dark-border">
                <p className="text-xs text-gray-400 mb-1 font-mono">{key}</p>
                {data.error ? (
                  <p className="text-red-400 text-sm">Error: {data.error}</p>
                ) : (
                  <>
                    <p className="text-white font-medium text-lg break-all">
                      {typeof data.value === 'string' && data.value.length > 50
                        ? `${data.value.slice(0, 50)}...`
                        : data.value}
                    </p>
                    {data.type && (
                      <p className="text-xs text-gray-500 mt-1">Type: {data.type}</p>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          No read functions available
        </div>
      )}
    </div>
  )
}

export default ReadFunctions

