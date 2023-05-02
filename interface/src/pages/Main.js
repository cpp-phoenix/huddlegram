import { useNetwork, useAccount, erc20ABI, useProvider, useSigner } from 'wagmi';
import { useEffect, useState } from 'react';
import qs from 'qs';
import { ethers, utils } from "ethers";

function Main() {

    const[publicPosts, setPublicPosts] = useState([])

    useEffect(() => {
        try {
            (async () => {
                const publicData = await (await fetch(`http://127.0.0.1:3001/api/posts/gated/`,)).json();
                console.log(publicData)
                setPublicPosts(publicData['data'])
            })();
        } catch(error) {

        }
    }, [])


    const Posts = ({postList}) => {
        if (postList.length === 0) {
            return (
                <div className='flex items-center justify-center h-full'>
                    No Posts Yet
                </div>
            )
        }
        return (
            <div className='grid grid-cols-1 gap-1 h-full mt-10'>
                {postList.map(post => {
                    const source = "https://" + post['url'];
                    return (
                        <div className='rounded-md w-76 h-72 border my-2 pb-6' key={post['_id']}>
                            <div>
                                profile pic
                                Username
                            </div>
                            <video src={source} className="w-full h-full" type="video/mp4" controls></video>
                        </div>
                    )
                })}
            </div>
        )
    } 

    return (
        <div className="flex flex-1 items-center justify-center h-[710px] overflow-y-scroll ">
            <Posts postList={publicPosts}/>
        </div>
    )
}
export default Main;
