import '@rainbow-me/rainbowkit/styles.css';
import { useHuddle01 } from '@huddle01/react';
import { useEffect } from 'react';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { filecoinHyperspace } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import Main from './pages/Main';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import Record from './pages/Record';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const { chains, provider } = configureChains([filecoinHyperspace], [publicProvider()])

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId: 'huddlegram',
  chains
});

const client = createClient({
  connectors,
  provider,
})

function App() {
  const { initialize } = useHuddle01();

  useEffect(() => {
    initialize('KL1r3E1yHfcrRbXsT4mcE-3mK60Yc3YR');
  }, []);

  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider chains={chains}>
        <div className="w-screen h-screen">
          <Router>
            <Navbar/>
            <Routes>
              <Route path='/' exact element={<Main/>} />
              <Route path='/profile' exact element={<Profile/>} />
              <Route path='/record' exact element={<Record/>} />
            </Routes>
          </Router>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
