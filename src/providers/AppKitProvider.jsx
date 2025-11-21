import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { arbitrum, base, celo, mainnet } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId from https://dashboard.reown.com
// You can set this via environment variable or replace with your actual project ID
const projectId = import.meta.env.VITE_REOWN_PROJECT_ID || '39620c2d95c222279e45e3862fba2338'

// 2. Create a metadata object - optional
const metadata = {
  name: 'Token Website',
  description: 'Token Details & Contract Interaction',
  url: window.location.origin,
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// 3. Set the networks - Base first to make it default
const networks = [base, mainnet, arbitrum, celo]

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
})

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  defaultChain: base, // Set Base as default chain
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
})

export function AppKitProvider({ children }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

