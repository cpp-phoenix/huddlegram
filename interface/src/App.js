import '@rainbow-me/rainbowkit/styles.css';
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
import Post from './pages/Post';
import Search from './pages/Search';
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
  return (
      <WagmiConfig client={client}>
        <RainbowKitProvider chains={chains}>
          <div className="w-screen h-screen bg-black">
            <Router>
              <Navbar/>
              <Routes>
                <Route path='/' exact element={<Main/>} />
                <Route path='/profile' exact element={<Profile/>} />
                <Route path='/record' exact element={<Record/>} />
                <Route path='/post' exact element={<Post/>} />
                <Route path='/search' exact element={<Search/>} />
              </Routes>
            </Router>
          </div>
        </RainbowKitProvider>
      </WagmiConfig>
  );
}

export default App;
