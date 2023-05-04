import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NavLink as Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Navbar () {

    const[selectedPage, setSelectedPage] = useState("feed");

    return (
        <div className="flex items-center justify-between w-full h-20 bg-black px-12 border-b border-gray-600">
            <Link className="font-semibold text-3xl text-blue-500" to='/'>
                Huddlegram
            </Link>
            <div className="space-x-20 text-gray-500 font-normal">
                <Link className={`text-lg ${selectedPage === 'record' ? 'text-gray-300' : ''} hover:text-gray-300`} to='/record' onClick={() => setSelectedPage('record')}>Record</Link>
                <Link className={`text-lg ${selectedPage === 'post' ? 'text-gray-300' : ''} hover:text-gray-300`} to='/post' onClick={() => setSelectedPage('post')}>Post</Link>
                <Link className={`text-lg ${selectedPage === 'feed' ? 'text-gray-300' : ''} hover:text-gray-300`} to='/' onClick={() => setSelectedPage('feed')}>Feed</Link>
                <Link className={`text-lg ${selectedPage === 'search' ? 'text-gray-300' : ''} hover:text-gray-300`} to='/search' onClick={() => setSelectedPage('search')}>Search</Link>
                <Link className={`text-lg ${selectedPage === 'profile' ? 'text-gray-300' : ''} hover:text-gray-300`} to='/profile' onClick={() => setSelectedPage('profile')}>Profile</Link>
                {/* <Link className="font-semibold text-lg" to='/stats'>Analytics</Link> */}
            </div>
            <div className="">
                <ConnectButton chainStatus="icon" showBalance={false}/>
            </div>
        </div>
    )
}

export default Navbar;
