import axios from 'axios';
import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react';
import { HuddleIframe, huddleIframeApp, HuddleAppEvent } from "@huddle01/huddle01-iframe";

function Record() {
    const { address, isConnected } = useAccount()
    const [isLoading, setIsLoading] = useState(true)
    const [loggedIn, setLoggedIn] = useState(false)
    const [roomUrl, setRoomUrl] = useState()

    // const iframeConfig = {
    //     roomUrl: roomUrl,
    //     height: "550px",
    //     width: "80%",
    //     noBorder: false, // false by default
    // };    

    // huddleIframeApp.on("iframe-event", (data) => console.log("Testing data is: ", { data }));

    // useEffect(() => {
    //     console.log("Room id: ", roomUrl)
    //     if(roomUrl !== undefined && roomUrl.length > 0) {
    //         huddleIframeApp.methods.connectWallet(address)
    //         setIsLoading(false)
    //     }
    // },[roomUrl])

    // useEffect(() => {
    //     if(isConnected) {
    //         try {
    //             (async () => {
    //                 const data = await (await fetch(`http://127.0.0.1:3001/api/profiles/${address}`,)).json();
    //                 if(data['data'] != null) {
    //                     try{
    //                         const response = await axios.post(
    //                             'https://iriko.testing.huddle01.com/api/v1/create-iframe-room',
    //                             {
    //                               roomLocked: false,
    //                               title: 'Huddle01-Test',
    //                               hostWallets: [address],
    //                               muteOnEntry: true,
    //                               videoOnEntry: true
    //                             },
    //                             {
    //                               headers: {
    //                                 'Content-Type': 'application/json',
    //                                 'x-api-key': "VwTZ4AGTxme9snANex9tep3NwvVMGfYd",
    //                               }
    //                             }
    //                         );

    //                         const roomResponse = await axios.post(
    //                             'https://iriko.testing.huddle01.com/api/v1/join-room-token',
    //                             {
    //                                 userType: "host",
    //                                 guestAsHost: true,
    //                                 roomId: response.data['data']['roomId'],
    //                                 displayName: "host",
                                    
    //                             },
    //                             {
    //                               headers: {
    //                                 'Content-Type': 'application/json',
    //                                 'x-api-key': "VwTZ4AGTxme9snANex9tep3NwvVMGfYd",
    //                               },
    //                             }
    //                           );
    //                         setRoomUrl(roomResponse.data['redirectUrl'])
    //                         setLoggedIn(true)
    //                     } catch (error) {

    //                     }
    //                 }
    //             })();
    //         } finally {
                
    //         }
    //     } else {
    //         setIsLoading(true)
    //         setLoggedIn(false)
    //     }
    // },[isConnected])

    // if(isLoading) return (
    //     <div>
    //         Loading....
    //     </div>
    // )
    
    // if(!loggedIn) return (
    //     <div>
    //         Not loggedIn
    //     </div>
    // )

    return (
        <div>
            <div className='w-full h-full flex justify-center mt-10'>
                {/* <HuddleIframe config={iframeConfig} /> */}
            </div>
            <div className='w-full flex flex-row justify-center space-x-24 mt-4'>
                <button className='border rounded-lg px-4 py-4 bg-blue-500 hover:bg-blue-600 text-white'  onClick={() => huddleIframeApp.methods.startRecording({uploadToIpfs: true})}>Start Recording</button>
           </div>
        </div>
    )
}
export default Record;
