import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { FINNACLE_TOKEN_ABI } from '../constants/finnacleABI'

const WriteFunctions = ({ contractAddress, account, provider }) => {
  const [contract, setContract] = useState(null)
  const [selectedFunction, setSelectedFunction] = useState('')
  const [functionParams, setFunctionParams] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [writeFunctions, setWriteFunctions] = useState([])

  useEffect(() => {
    if (contractAddress && provider) {
      try {
        const contractInstance = new ethers.Contract(contractAddress, FINNACLE_TOKEN_ABI, provider)
        setContract(contractInstance)
        
        // Extract write functions from ABI
        const writeFuncs = FINNACLE_TOKEN_ABI.filter(
          item => item.type === 'function' && item.stateMutability !== 'view' && item.stateMutability !== 'pure'
        )
        setWriteFunctions(writeFuncs)
      } catch (err) {
        console.error('Error initializing contract:', err)
        setError('Failed to initialize contract.')
      }
    }
  }, [contractAddress, provider])

  const handleFunctionSelect = (funcName) => {
    setSelectedFunction(funcName)
    setFunctionParams({})
    setResult(null)
    setError(null)
  }

  const handleParamChange = (paramName, value) => {
    setFunctionParams(prev => ({
      ...prev,
      [paramName]: value
    }))
  }

  const executeWriteFunction = async () => {
    if (!contract || !selectedFunction || !account) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const signer = await provider.getSigner()
      const contractWithSigner = contract.connect(signer)

      const func = writeFunctions.find(f => f.name === selectedFunction)
      if (!func) {
        throw new Error('Function not found')
      }

      // Build parameters array in order
      const params = func.inputs.map(input => {
        const value = functionParams[input.name] || ''
        
        // Convert based on type
        if (input.type === 'uint256' || input.type === 'uint8') {
          if (input.type.includes('uint256')) {
            // For token amounts, assume 18 decimals
            return ethers.parseUnits(value || '0', 18)
          }
          return BigInt(value || '0')
        } else if (input.type === 'address') {
          return value
        } else if (input.type.includes('[]')) {
          // Array type
          try {
            return JSON.parse(value)
          } catch {
            return value.split(',').map(v => v.trim())
          }
        }
        return value
      })

      const tx = await contractWithSigner[selectedFunction](...params)
      setResult(`Transaction sent: ${tx.hash}\nWaiting for confirmation...`)
      
      const receipt = await tx.wait()
      setResult(`Transaction confirmed!\nHash: ${receipt.hash}\nBlock: ${receipt.blockNumber}\nGas Used: ${receipt.gasUsed.toString()}`)
    } catch (err) {
      console.error('Error executing function:', err)
      setError(err.message || 'Failed to execute function. Check parameters and ensure you have sufficient funds.')
    } finally {
      setLoading(false)
    }
  }

  if (!contractAddress || !account || !provider) return null

  const selectedFunc = writeFunctions.find(f => f.name === selectedFunction)

  return (
    <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
      <h2 className="text-2xl font-semibold text-white mb-4">
        Write Functions
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Function
          </label>
          <select
            value={selectedFunction}
            onChange={(e) => handleFunctionSelect(e.target.value)}
            className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose a function...</option>
            {writeFunctions.map((func, idx) => (
              <option key={idx} value={func.name}>
                {func.name}({func.inputs.map(i => `${i.type} ${i.name}`).join(', ')})
              </option>
            ))}
          </select>
        </div>

        {selectedFunc && (
          <>
            <div className="bg-dark-card rounded-lg p-4 border border-dark-border">
              <p className="text-sm text-gray-400 mb-3">Function Parameters:</p>
              <div className="space-y-3">
                {selectedFunc.inputs.map((input, idx) => (
                  <div key={idx}>
                    <label className="block text-xs text-gray-400 mb-1">
                      {input.name} ({input.type})
                    </label>
                    <input
                      type="text"
                      value={functionParams[input.name] || ''}
                      onChange={(e) => handleParamChange(input.name, e.target.value)}
                      placeholder={`Enter ${input.type}`}
                      className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={executeWriteFunction}
              disabled={loading || !selectedFunction}
              className="w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {loading ? 'Executing...' : `Execute ${selectedFunction}`}
            </button>
          </>
        )}

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

export default WriteFunctions

