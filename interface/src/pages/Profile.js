import { useAccount } from 'wagmi'
import ClickAwayListener from 'react-click-away-listener';
import { useEffect, useState } from 'react';

function Profile() {
    const { address, isConnected } = useAccount()
    const [isLoading, setIsLoading] = useState(true)
    const [loggedIn, setloggedIn] = useState(false)
    const [showLoginPopup, setShowLoginPopup] = useState(false)
    const [name, setName] = useState("")
    const [desc, setDesc] = useState("")
    const [pic, setPic] = useState()
    const [data, setData] = useState({})
    const [showPosts, setShowPosts] = useState("public")
    useEffect(() => {
        console.log(process.env.STORAGE_API_KEY)
        if(isConnected) {
            try {
                (async () => {
                    const data = await (await fetch(`http://127.0.0.1:3001/api/profiles/${address}`,)).json();
                    console.log(data['data'])
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


    const saveProfile = async () => {
        console.log(name, desc, pic)
        setShowLoginPopup(false)
        setIsLoading(true)
        try {
            (async () => {
                const requestOptions = {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        "Access-Control-Allow-Origin": "*",
                    },
                    body: JSON.stringify({
                        'name': name,
                        'description': desc,
                        "_id": address
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
                                    <div className='rounded-lg border border-cyan-500 popup absolute bg-white p-4 text-xl space-y-2'>
                                        {/* <div className='flex flex-row space-x-2'>
                                            <div>Picture</div>
                                            <label className="block">
                                                <span className="sr-only">Choose profile photo</span>
                                                <input onChange={(e) => {setPic(e.target.value)}} type="file" accept="image/png, image/jpeg" className="block w-full text-sm text-slate-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-violet-50 file:text-violet-700
                                                hover:file:bg-violet-100
                                                "/>
                                            </label>
                                        </div> */}
                                        <div className='flex flex-row space-x-2'>
                                            <div>Name</div>
                                            <input onChange={(e) => {setName(e.target.value)}} type="text" className='border border-slate-300 rounded-sm text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500' />
                                        </div>
                                        <div className='flex flex-row space-x-2'>
                                            <div>Description</div>
                                            <input onChange={(e) => {setDesc(e.target.value)}} type="text" className='border border-slate-300 rounded-sm text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500' />
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
