import axios from 'axios';
import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react';
import { Web3Storage } from 'web3.storage'
import { useAlert, positions } from 'react-alert';

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

function Post() {
    const { address, isConnected } = useAccount()
    const [isLoading, setIsLoading] = useState(true)
    const [loggedIn, setloggedIn] = useState(false)
    const [videoData, setVideoData] = useState(null)
    const [objectUrl, setObjectUrl] = useState(null)
    const [gated, setGated] = useState(false)
    const [data, setData] = useState(null)

    const alert = useAlert()

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

    const uploadFiles = async () => {
        if(videoData) {
            let files = [];
            files.push(videoData);
            alert.info(<div>uploading...</div>, {
                timeout: 4000,
                position: positions.BOTTOM_RIGHT
            });
            let ipfsLink = await storeFiles(files);
            alert.success(<div>file uploaded</div>, {
                timeout: 4000,
                position: positions.BOTTOM_RIGHT
            });
            const url = "https://" + ipfsLink + ".ipfs.w3s.link/" + videoData.name
            console.log("Url: ", url);
            try{
                const response = await axios.post(
                    'http://127.0.0.1:3001/api/posts',
                    {
                        id: address,
                        gated: gated,
                        url: url,
                        nftContract: data['nftContract']
                    },
                    {
                      headers: {
                        'Content-Type': 'application/json',
                      }
                    }
                );
                alert.success(<div>data saved</div>, {
                    timeout: 4000,
                    position: positions.BOTTOM_RIGHT
                });
                console.log(response)
            } catch(error) {

            }

            //Contract Call
            // mintNFT("ipfs://" + outputLink + "/" + jsonFileName);
        }
    }

    if(isLoading) return (
        <div>Loading...</div>
    )

    if(!loggedIn) return (
        <div>Not logged in..</div>
    )

    return (
        <div className="flex flex-col items-center justify-center h-[710px] space-y-10 text-white">
            {videoData ? <video src={objectUrl} width="750" height="500" controls>
            </video> : ""}
            <div className='flex flex-row space-x-2'>
                <label className="block">
                    <span className="sr-only">Choose media</span>
                    <input onChange={(e) => {setVideoData(e.target.files[0]); setObjectUrl(URL.createObjectURL(e.target.files[0]))}} type="file" accept="video/*" className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-violet-50 file:text-violet-700
                    hover:file:bg-violet-100
                    "/>
                </label>
            </div>
            {videoData ? 
                <div className='flex flex-col space-y-4'>
                    <div className='flex flex-row space-x-2'> 
                        <input onChange={(e) => {setGated(e.target.checked)}} type="checkbox" class="default:ring-2 ..." /> 
                        <div>Premium</div>
                    </div>
                    <button className='rounded-md px-4 py-2 text-white bg-blue-500 hover:bg-blue-600' onClick={() => uploadFiles()}>Upload</button>
                </div> 
            : ""}
        </div>
    )
}
export default Post;
