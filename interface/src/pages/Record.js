import { useAccount } from 'wagmi'
import { useRecording, useVideo, useAudio, useRoom, useLivestream, useLobby} from '@huddle01/react/hooks';
import { useHuddle01 } from '@huddle01/react';
import { useEffect, useState } from 'react';

function Record() {
    const { data, startRecording, stoprecording, isStarting, inProgress, isStopping, error } = useRecording();
    const { startLivestream, stopLivestream, isStarting: livestreamStarting, inProgress: livestreamProgress, isStopping: livestreamStopping, error: livestreamError } = useLivestream();
    const { fetchVideoStream, produceVideo ,stopVideoStream, isProducing, stream, error: videoError} = useVideo();
    const { fetchAudioStream, produceAudio, stopAudioStream, isProducing: audioProducing, error: audioError} = useAudio();
    const { joinRoom, leaveRoom, isLoading, isRoomJoined, roomId, error: roomError } = useRoom();
    const { joinLobby,leaveLobby, isLoading: lobbyLoading, isLobbyJoined, error: lobbyError } = useLobby();
    const { address, isConnected } = useAccount()
    const [loggedIn, setloggedIn] = useState(false)
    const { initialize, isInitialized } = useHuddle01()

    useEffect(() => {
        if(isConnected) {
            try {
                (async () => {
                    const data = await (await fetch(`http://127.0.0.1:3001/api/profiles/${address}`,)).json();
                    if(data['data'] != null) {
                        setloggedIn(true)
                    }
                })();
            } finally {
                
            }
        } else {
            setloggedIn(false)
        }
    },[isConnected])

    useEffect(() => {
        if(isInitialized) {
            console.log(isInitialized)
            joinLobby('AVL_SVL')
            // joinRoom()
            // startLivestream("http://127.0.0.1:3001")
            // fetchVideoStream()
            // fetchAudioStream()
        }
    }, [isInitialized])


    useEffect(() => {
        initialize('KL1r3E1yHfcrRbXsT4mcE-3mK60Yc3YR');
    },[])
    
    if(inProgress || !loggedIn || !isInitialized) return (<div className='flex w-full h-5/6 items-center justify-center'>...loading</div>)
    return (
        <div className="flex flex-col items-center h-5/6 space-x-10">
            {/* <div>
                {livestreamProgress ? "Livestream is starting": livestreamError}
            </div>
            <div>
                {isRoomJoined ? "Room is starting": roomError}
            </div> */}
            <div>
                {isLobbyJoined ? "Lobby is starting": "Lobby error" + lobbyError + isLoading}
            </div>
            {/* <div className='rounded-md border-2 border-blue-500 border w-4/12 h-5/6 my-10'>

            </div>
            <div className='flex flex-row space-x-10'>
                <div>            
                    <button className='rounded-lg border px-4 py-2 bg-blue-500 text-white' onClick={() => produceAudio()}>
                        Audio
                    </button>
                    <div>{audioProducing ? "Audio is starting": audioError} </div>
                </div>
                <div>            
                    <button className='rounded-lg border px-4 py-2 bg-blue-500 text-white' onClick={() => produceVideo()}>
                        Video
                    </button>
                    <div>{isProducing ? "Video is starting": videoError} </div>
                </div>
                <div>            
                    <button className='rounded-lg border px-2 py-2 bg-blue-500 text-white' onClick={() => startRecording("http://127.0.0.1:3000")}>
                        START_RECORDING
                    </button>
                    <div>{isStarting ? "Recording is starting": error} </div>
                </div>
                <div>
                    <button className='rounded-lg border px-2 py-2 bg-red-500 text-white' onClick={stoprecording}>
                        STOP_RECORDING
                    </button>
                </div>
            </div> */}
        </div>
    )
}
export default Record;
