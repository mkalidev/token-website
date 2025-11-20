import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { FINNACLE_TOKEN_ABI } from '../constants/finnacleABI'

const ContractInteraction = ({ contractAddress, account, provider }) => {
  const [contract, setContract] = useState(null)
  const [abi, setAbi] = useState('')
  const [functionName, setFunctionName] = useState('')
  const [functionParams, setFunctionParams] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [readOnlyFunctions, setReadOnlyFunctions] = useState([])
  const [writeFunctions, setWriteFunctions] = useState([])

  useEffect(() => {
    if (contractAddress && provider && abi) {
      try {
        const parsedAbi = JSON.parse(abi)
        const contractInstance = new ethers.Contract(contractAddress, parsedAbi, provider)
        setContract(contractInstance)
        
        // Extract read-only functions from ABI
        const readFunctions = parsedAbi.filter(
          item => item.type === 'function' && (item.stateMutability === 'view' || item.stateMutability === 'pure')
        )
        setReadOnlyFunctions(readFunctions)
        
        // Extract write functions from ABI
        const writeFuncs = parsedAbi.filter(
          item => item.type === 'function' && item.stateMutability !== 'view' && item.stateMutability !== 'pure'
        )
        setWriteFunctions(writeFuncs)
      } catch (err) {
        console.error('Error parsing ABI:', err)
        setError('Invalid ABI format. Please check your JSON.')
      }
    }
  }, [contractAddress, provider, abi])

  const callReadFunction = async () => {
    if (!contract || !functionName) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      let params = []
      if (functionParams.trim()) {
        try {
          params = JSON.parse(functionParams)
          if (!Array.isArray(params)) {
            params = [params]
          }
        } catch {
          // If not valid JSON, treat as single string parameter
          params = [functionParams]
        }
      }

      const result = await contract[functionName](...params)
      
      // Format the result
      if (Array.isArray(result) && result.length === 1) {
        setResult(result[0].toString())
      } else if (typeof result === 'object' && result.toString) {
        setResult(result.toString())
      } else {
        setResult(JSON.stringify(result, null, 2))
      }
    } catch (err) {
      console.error('Error calling function:', err)
      setError(err.message || 'Failed to call function. Check function name and parameters.')
    } finally {
      setLoading(false)
    }
  }

  const loadFinnacleABI = () => {
    setAbi(JSON.stringify(FINNACLE_TOKEN_ABI, null, 2))
    setError(null)
  }

  const callWriteFunction = async () => {
    if (!contract || !functionName || !account) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const signer = await provider.getSigner()
      const contractWithSigner = contract.connect(signer)

      let params = []
      if (functionParams.trim()) {
        try {
          params = JSON.parse(functionParams)
          if (!Array.isArray(params)) {
            params = [params]
          }
        } catch {
          params = [functionParams]
        }
      }

      const tx = await contractWithSigner[functionName](...params)
      setResult(`Transaction sent: ${tx.hash}\nWaiting for confirmation...`)
      
      const receipt = await tx.wait()
      setResult(`Transaction confirmed!\nHash: ${receipt.hash}\nBlock: ${receipt.blockNumber}`)
    } catch (err) {
      console.error('Error calling function:', err)
      setError(err.message || 'Failed to call function. Check function name, parameters, and ensure you have sufficient funds.')
    } finally {
      setLoading(false)
    }
  }

  if (!contractAddress || !account) return null

  return (
    <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
      <h2 className="text-2xl font-semibold text-white mb-4">
        Contract Interaction
      </h2>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-300">
              Contract ABI (JSON)
            </label>
            <button
              onClick={loadFinnacleABI}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-medium transition-colors"
            >
              Load Finnacle ABI
            </button>
          </div>
          <textarea
            value={abi}
            onChange={(e) => setAbi(e.target.value)}
            placeholder='[{"type":"function","name":"myFunction",...}]'
            className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            rows="4"
          />
          <p className="text-xs text-gray-500 mt-1">
            Paste the contract ABI JSON to enable function calls
          </p>
        </div>

        {(readOnlyFunctions.length > 0 || writeFunctions.length > 0) && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Available Functions
            </label>
            <select
              value={functionName}
              onChange={(e) => setFunctionName(e.target.value)}
              className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a function...</option>
              {readOnlyFunctions.length > 0 && (
                <optgroup label="Read Functions">
                  {readOnlyFunctions.map((func, idx) => (
                    <option key={`read-${idx}`} value={func.name}>
                      {func.name} ({func.stateMutability})
                    </option>
                  ))}
                </optgroup>
              )}
              {writeFunctions.length > 0 && (
                <optgroup label="Write Functions">
                  {writeFunctions.map((func, idx) => (
                    <option key={`write-${idx}`} value={func.name}>
                      {func.name} ({func.stateMutability})
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Function Name
          </label>
          <input
            type="text"
            value={functionName}
            onChange={(e) => setFunctionName(e.target.value)}
            placeholder="functionName"
            className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Parameters (JSON array or single value)
          </label>
          <input
            type="text"
            value={functionParams}
            onChange={(e) => setFunctionParams(e.target.value)}
            placeholder='["param1", "param2"] or single value'
            className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={callReadFunction}
            disabled={loading || !contract || !functionName}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {loading ? 'Calling...' : 'Call (Read)'}
          </button>
          <button
            onClick={callWriteFunction}
            disabled={loading || !contract || !functionName}
            className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {loading ? 'Sending...' : 'Call (Write)'}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="p-3 bg-green-900/30 border border-green-700 rounded-lg">
            <p className="text-green-300 text-sm font-medium mb-1">Result:</p>
            <pre className="text-green-200 text-xs whitespace-pre-wrap break-all">
              {result}
            </pre>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p className="font-medium">Contract Address:</p>
          <p className="text-blue-400 font-mono break-all">{contractAddress}</p>
        </div>
      </div>
    </div>
  )
}

export default ContractInteraction

