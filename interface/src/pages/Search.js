import { useEffect, useState } from "react";
import { useAccount } from 'wagmi'
import { ethers } from 'ethers';
import contractAbi from '../nftABI.json';
import { useSigner, useProvider } from "wagmi";
import { waitForTransaction } from '@wagmi/core'

function Search() {
    const { data: signer } = useSigner();
    const { data: provider } = useProvider();
    const { address, isConnected } = useAccount()
    const[loading, setLoading] = useState(false)
    const[loggedIn, setloggedIn] = useState(false)
    const[searchKey, setSearchKey] = useState("")
    const[profileData, setProfileData] = useState(null)
    const[showPosts, setShowPosts] = useState("public")
    const[publicPosts, setPublicPosts] = useState([])
    const[gatedPosts, setGatedPosts] = useState([])
    const[gatedAccess, setGatedAccess] = useState(false)
    const[myData, setMyData] = useState(null)

    useEffect(() => {
        if(isConnected) {
            try {
                (async () => {
                    const data = await (await fetch(`http://127.0.0.1:3001/api/profiles/${address}`,)).json();
                    if(data['data'] != null) {
                        setMyData(data['data'])
                        setloggedIn(true)
                    }
                })();
            } catch(error) {

            }
        }
    },[isConnected])

    useEffect(() => {
        if(gatedAccess) {
            (async () => {
                const gatedData = await (await fetch(`http://127.0.0.1:3001/api/posts/gated/${profileData['_id']}`,)).json();
                console.log(gatedData)
                setGatedPosts(gatedData['data'])
            })();
        }
    }, [gatedAccess])

    useEffect(() => {
        if(profileData) {
            try {
                (async () => {
                    if(profileData["_id"] === myData["_id"]) {
                        setGatedAccess(true)
                    } else {
                        const nftContract = new ethers.Contract(profileData["nftContract"],contractAbi.abi,provider);
                        const signedNftContract = await nftContract.connect(signer);
                        const balance = await signedNftContract.balanceOf(address);
                        console.log("Balance is: ", balance.toNumber())
                        if(balance.toNumber() > 0) {
                            setGatedAccess(true)
                        }
                    }
                })();
            } catch(error) {

            }
        }
    },[profileData])

    const searchProfile = async () => {
        setLoading(true)
        try{
            const publicData = await (await fetch(`http://127.0.0.1:3001/api/profiles/username/${searchKey}`,)).json();
            const profiles = publicData['data']
            console.log(profiles)
            if(profiles.length === 0) {
                
            } else {
                console.log("Profile data here: ", profiles[0])
                setProfileData(profiles[0])
                const publicData = await (await fetch(`http://127.0.0.1:3001/api/posts/public/${profiles[0]['_id']}`,)).json();
                console.log(publicData)
                setPublicPosts(publicData['data'])
                console.log(publicData['data'])

            }
            setLoading(false)
        } catch(error) {
            
        }

    }

    const mintNFT = async () => {
        const nftContract = new ethers.Contract(profileData["nftContract"],contractAbi.abi,provider);
        const signedNftContract = await nftContract.connect(signer);
        const txnReceipt = await signedNftContract.mintNFT({value: ethers.utils.parseUnits(profileData["contentCost"], "ether")});
        console.log(txnReceipt)
        const waitForTransactionValue = await waitForTransaction({
            hash: txnReceipt,
            confirmations: 1,
        })
        setGatedAccess(true)
    }

    const Posts = ({postList}) => {
        if (postList.length === 0) {
            return (
                <div className='flex items-center justify-center h-full'>
                    No Posts Yet
                </div>
            )
        }
        return (
            <div className='grid grid-cols-3 gap-1 h-full'>
                {postList.map(post => {
                    const source = "https://" + post['url'];
                    return (
                        <div className='rounded-md w-76 h-72 border' key={post['_id']}>
                            <video src={source} className="w-full h-full" type="video/mp4" controls></video>
                        </div>
                    )
                })}
            </div>
        )
    } 

    const ProfileTab = () => {
        return (
            <div className="w-full h-full">
                <div className="h-content flex flex-col items-center justify-center">
                    <div className='flex flex-rows space-x-20 my-10 items-center'>
                        <div className='border border-2 rounded-full w-40 h-40 p-1'>
                            <img src={myData["picture"]}  className='rounded-full w-full h-full'/>
                        </div>
                        <div className='space-y-2'>
                            <div className='flex flex-rows space-x-4'>
                                {/* <div>Username: </div> */}
                                <div className='font-semibold text-xl'>{myData['name'] !==null ? myData['name']: 'username not found'}</div>
                                {/* <button className='rounded-lg border bg-blue-500 text-white px-2 py-2' onClick={() => setShowLoginPopup(true)}>Edit Profile</button> */}
                            </div>
                            <div className='flex flex-row space-x-2 font-medium'>
                                <div>{myData['maxSupply']} nfts</div>
                                <div>{myData['contentCost']}/nft</div>
                            </div>
                            <div className='flex flex-col'>
                                <div className='text-sm font-semibold'>Description</div>
                                <div className='text-sm '>{myData['description'] !==null ? myData['description']: 'description not found'}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-3/6">   
                    <div className='flex flex-rows w-full border-t justify-center space-x-20'>
                        <button className={`pt-2 h-10 w-24 font-bold ${showPosts === 'public' ? 'border-t-2 border-gray-600 text-gray-900' : 'text-gray-400' } flex justify-center items-center`} onClick = {() => setShowPosts('public')}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 96 960 960" width="28"><path d="M200 936V271q0-24 18-42t42-18h440q24 0 42 18t18 42v665L480 816 200 936Zm60-91 220-93 220 93V271H260v574Zm0-574h440-440Z"/></svg>
                            POSTS
                        </button>
                        <button className={`pt-2 h-10 w-24 font-bold ${showPosts === 'gated' ? 'border-t-2 border-gray-600 text-gray-900' : 'text-gray-400' } flex justify-center items-center`} onClick = {() => setShowPosts('gated')}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 96 960 960" width="28"><path d="m385 644 36-115-95-74h116l38-119 37 119h117l-95 74 35 115-94-71-95 71Zm-141 372V712q-45-47-64.5-103T160 496q0-136 92-228t228-92q136 0 228 92t92 228q0 57-19.5 113T716 712v304l-236-79-236 79Zm236-260q109 0 184.5-75.5T740 496q0-109-75.5-184.5T480 236q-109 0-184.5 75.5T220 496q0 109 75.5 184.5T480 756ZM304 932l176-55 176 55V761q-40 29-86 42t-90 13q-44 0-90-13t-86-42v171Zm176-86Z"/></svg>
                            GATED
                        </button>
                    </div> 
                    <div className='w-full flex items-center justify-center overflow-y-scroll h-full'>
                        <div className='w-8/12 my-4 h-5/6'>
                            {
                            showPosts === 'public' ? 
                            <Posts postList={publicPosts}/>
                            :
                            gatedAccess ? <Posts postList={gatedPosts}/> :
                            <div className="h-96 flex flex-col justify-center items-center border space-y-4"> 
                                <div>Mint NFT To Gain Exclusive Access</div> 
                                <button className="rounded-md px-4 py-2 bg-blue-500 text-white hover:bg-blue-600" onClick={() => mintNFT()}>Mint</button>
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center w-full h-[710px]">
            <div className="flex flex-row space-x-4 my-4">
                <label class="relative block">
                    <span class="sr-only">Search</span>
                    <span class="absolute inset-y-0 left-0 flex items-center pl-2">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="26"><path d="M796 935 533 672q-30 26-69.959 40.5T378 727q-108.162 0-183.081-75Q120 577 120 471t75-181q75-75 181.5-75t181 75Q632 365 632 471.15 632 514 618 554q-14 40-42 75l264 262-44 44ZM377 667q81.25 0 138.125-57.5T572 471q0-81-56.875-138.5T377 275q-82.083 0-139.542 57.5Q180 390 180 471t57.458 138.5Q294.917 667 377 667Z"/></svg>
                    </span>
                    <input onChange={(e) => {setSearchKey(e.target.value)}}   class="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="Search for username..." type="text" name="search"/>
                </label>
                {/* <input type="text" className='border border-slate-300 rounded-sm text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500' /> */}
                <button className="rounded-md px-4 bg-blue-500 text-white" onClick={() => searchProfile()}>Search</button>
            </div>
            <div className="h-full w-full flex items-center justify-center">
                {
                    loading || !loggedIn ? <div>Loading</div> : profileData == null ? <div> No Profile Found </div> :
                    <div className="h-full w-8/12">
                        <ProfileTab />
                    </div>
                }
            </div>
        </div>
    )
}
export default Search;