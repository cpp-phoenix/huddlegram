import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NavLink as Link } from 'react-router-dom';

function Navbar () {
    return (
        <div className="flex items-center justify-between w-full h-20 bg-gray-200 px-12 border-b-2 border-blue-400">
            <Link className="font-semibold text-3xl text-blue-500 hover:text-orange-500" to='/'>
                Huddlegram
            </Link>
            <div className="space-x-28 text-[#121517]">
                <Link className="font-semibold text-xl" to='/record'>Record</Link>
                <Link className="font-semibold text-xl" to='/post'>Post</Link>
                <Link className="font-semibold text-xl" to='/'>Feed</Link>
                <Link className="font-semibold text-xl" to='/profile'>Profile</Link>
                {/* <Link className="font-semibold text-lg" to='/stats'>Analytics</Link> */}
            </div>
            <div className="">
                <ConnectButton chainStatus="icon" showBalance={false}/>
            </div>
        </div>
    )
}

export default Navbar;
