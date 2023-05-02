import { useAccount } from 'wagmi'
import ClickAwayListener from 'react-click-away-listener';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Web3Storage } from 'web3.storage';
import contractAbi from '../nftABI.json';
import { useSigner } from "wagmi";

function getAccessToken () {
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDIxQzc5Qjk4ZTE1ODIwNWEwNzMzMzM1NzEyZWIwMDRiRjhhN0Q0QzciLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjE2MzE4MDAxOTgsIm5hbWUiOiJTY2F0dGVyIn0.H0D97M3xr4g3eP7tn_8URf31vQYz5KrBT2NjB8gZB24";
}

function makeStorageClient () {
    return new Web3Storage({ token: getAccessToken() })
}

async function storeFiles(files) {
    const client = makeStorageClient()
    const cid = await client.put(files)
    return cid
}

function Profile() {
    const { data: signer, isError } = useSigner();
    const { address, isConnected } = useAccount()
    const [isLoading, setIsLoading] = useState(true)
    const [loggedIn, setloggedIn] = useState(false)
    const [showLoginPopup, setShowLoginPopup] = useState(false)
    const [name, setName] = useState("")
    const [desc, setDesc] = useState("")
    const [pic, setPic] = useState(null)
    const [nft, setNft] = useState(null)
    const [data, setData] = useState({})
    const [showPosts, setShowPosts] = useState("public")
    const [contentCost, setContentCost] = useState(0)
    const [tokenName, setTokenName] = useState("")
    const [tokenSymbol, setTokenSymbol] = useState("")
    const [tokenSupply, setTokenSupply] = useState(0)

    useEffect(() => {
        if(isConnected) {
            try {
                (async () => {
                    const data = await (await fetch(`http://127.0.0.1:3001/api/profiles/${address}`,)).json();
                    if(data['data'] != null) {
                        setData(data['data'])
                        setloggedIn(true)
                    }
                    setIsLoading(false)
                })();
            } finally {
                
            }
        } else {
            setIsLoading(true)
            setloggedIn(false)
        }
    },[isConnected])

    const uploadToIPFS = async (file) => {
        if(file) {
            let files = [];
            files.push(file);
            let ipfsLink = await storeFiles(files);
            const url = ipfsLink + ".ipfs.w3s.link/" + file.name
            return url

        } else {
            return ""
        }
    }

    const saveProfile = async () => {
        setShowLoginPopup(false)
        setIsLoading(true)

        console.log(name, desc, pic, nft)

        const picIpfs = await uploadToIPFS(pic)
        const nftIpfs = await uploadToIPFS(nft)

        console.log(picIpfs)
        console.log(nftIpfs)

        const factory = new ethers.ContractFactory(contractAbi.abi, contractAbi.bytecode, signer);
        const contract = await factory.deploy(tokenSupply, tokenName, tokenSymbol, nftIpfs);
        await contract.deployed();
        console.log(contract.address)

        try {
            (async () => {
                const requestOptions = {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        "Access-Control-Allow-Origin": "*",
                    },
                    body: JSON.stringify({
                        "_id": address,
                        "picture": picIpfs,
                        'description': desc,
                        'name': name,
                        'contentCost': contentCost,
                        'nftContract': contract.address,
                        'nftArtIpfs': nftIpfs,
                        'maxSupply': tokenSupply
                    })
                };
                const data = await (await fetch('http://127.0.0.1:3001/api/profiles/',requestOptions)).json();
                console.log(data['data'])
                if(data['data'] != null) {
                    setData(data['data'])
                    setloggedIn(true)
                }
            })();
        } catch (error) {
        } finally {
            setIsLoading(false)
        }
       
    }

    return (
        <div className="flex flex-1 justify-center h-5/6 overflow-y-scroll">
            {
                isLoading ? <div className='flex items-center'>Loading!!</div> :
                loggedIn ?
                <div className='flex w-full flex-col items-center overflow-y-scroll'>
                    <div className='flex flex-col h-72 justify-center'>
                        <div className='flex flex-rows space-x-10 my-10'>
                            {/* <div>Profile Picture</div> */}
                            <div>
                                <div className='flex flex-rows space-x-4'>
                                    <div>Username: </div>
                                    <div>{data['name'] !==null ? data['name']: 'username not found'}</div>
                                    {/* <button className='rounded-lg border bg-blue-500 text-white px-2 py-2' onClick={() => setShowLoginPopup(true)}>Edit Profile</button> */}
                                </div>
                                <div>Description: {data['description'] !==null ? data['description']: 'description not found'}</div>
                            </div>
                        </div>
                    </div> 
                    <div className='flex flex-rows w-full border-t justify-center space-x-20'>
                        <button className={`h-10 w-24 font-bold ${showPosts === 'public' ? 'border-t-2 border-gray-600 text-gray-900' : 'text-gray-400' } flex justify-center items-center`} onClick = {() => setShowPosts('public')}>POSTS</button>
                        <button className={`h-10 w-24 font-bold ${showPosts === 'gated' ? 'border-t-2 border-gray-600 text-gray-900' : 'text-gray-400' } flex justify-center items-center`} onClick = {() => setShowPosts('gated')}>GATED</button>
                    </div> 
                    <div>
                        {
                        showPosts === 'public' ? 
                        <div>
                            public
                        </div>
                        :
                        <div>
                            gated
                        </div>
                        }
                    </div>
                </div>
                : <div className='flex items-center w-full justify-center'>
                        <button className='rounded-md px-4 py-4 hover:bg-blue-600 bg-blue-500 text-white ' onClick={() => setShowLoginPopup(true)}>Please login</button>
                        {
                            showLoginPopup && (
                                <ClickAwayListener onClickAway={() => setShowLoginPopup(false)}>
                                    <div className='rounded-lg border border-cyan-500 popup absolute bg-white p-4 text-xl space-y-4'>
                                        <div className='flex flex-row space-x-2'>
                                            <div className='text-lg'>Profile Picture</div>
                                            <label className="block">
                                                <span className="sr-only">Choose profile photo</span>
                                                <input onChange={(e) => {setPic(e.target.files[0])}} type="file" accept="image/png, image/jpeg" className="block w-full text-sm text-slate-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-violet-50 file:text-violet-700
                                                hover:file:bg-violet-100
                                                "/>
                                            </label>
                                        </div>
                                        <div className='flex flex-row space-x-2'>
                                            <div className='text-lg'>Name</div>
                                            <input onChange={(e) => {setName(e.target.value)}} type="text" className='border border-slate-300 rounded-sm text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500' />
                                        </div>
                                        <div className='flex flex-row space-x-2'>
                                            <div className='text-lg'>Description</div>
                                            <input onChange={(e) => {setDesc(e.target.value)}} type="text" className='border border-slate-300 rounded-sm text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500' />
                                        </div>
                                        <div className='flex flex-row space-x-2'>
                                            <div className='text-lg'>NFT Art</div>
                                            <label className="block">
                                                <span className="sr-only">Choose profile photo</span>
                                                <input onChange={(e) => {setNft(e.target.files[0])}} type="file" accept="image/png, image/jpeg" className="block w-full text-sm text-slate-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-violet-50 file:text-violet-700
                                                hover:file:bg-violet-100
                                                "/>
                                            </label>
                                        </div>
                                        <div className='flex flex-row space-x-2'>
                                            <div className='text-lg'>Token Name</div>
                                            <input onChange={(e) => {setTokenName(e.target.value)}} type="text" className='border border-slate-300 rounded-sm text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500' />
                                        </div>
                                        <div className='flex flex-row space-x-2'>
                                            <div className='text-lg'>Token Symbol</div>
                                            <input onChange={(e) => {setTokenSymbol(e.target.value)}} type="text" className='border border-slate-300 rounded-sm text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500' />
                                        </div>
                                        <div className='flex flex-row space-x-2'>
                                            <div className='text-lg'>Total Supply</div>
                                            <input onChange={(e) => {setTokenSupply(e.target.value)}} type="number" className='border border-slate-300 rounded-sm text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500' />
                                        </div>
                                        <div className='flex flex-row space-x-2'>
                                            <div className='text-lg'>Gated Content Cost</div>
                                            <input onChange={(e) => {setContentCost(e.target.value)}} type="number" className='border border-slate-300 rounded-sm text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500' />
                                        </div>
                                        <div className='flex flex-rows justify-center space-x-4'>
                                            <button className='mt-2 rounded-lg px-4 py-2 border bg-blue-500 hover:bg-blue-600 text-white' onClick={() => saveProfile()}>Submit</button>
                                            <button className='mt-2 rounded-lg px-4 py-2 border bg-red-500 hover:bg-red-600 text-white' onClick={() => setShowLoginPopup(false)}>Close</button>
                                        </div>
                                    </div>
                                </ClickAwayListener>
                            )
                        }
                    </div>
            }
        </div>
    )
}
export default Profile;
