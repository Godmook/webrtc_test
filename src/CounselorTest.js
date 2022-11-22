import React, {useEffect, useState, Component, useRef} from "react";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
var stun_config = {
    'iceServers': [
        {
            "url": "stun:stun.l.google.com:19302"
        }
    ]
}
var MyStream;
var mediaConstraints = {
    'mandatory': {
        'OfferToReceiveAudio': true,
        'OfferToReceiveVideo': true
    }
};
const CounselorTest = () => {
    let audio = new MediaStream();
    let remoteVideo = new MediaStream();
    let remoteStream = new MediaStream();
    const [stream, setStream] = useState(null);
    useEffect(() => {
        remoteVideo = document.getElementById('userAudio');
        var ROOM_ID = prompt("");
        const pc = new RTCPeerConnection(stun_config);
        function handlerIceCandidate(e) {
            if (e.candidate) {
                stomp.send(
                    "/pub/data",
                    JSON.stringify({type: 'ice', sender: "counselor1", channelId: ROOM_ID, data: e.candidate})
                );
                console.log("ICE State: " + pc.iceConnectionState);
            }
        }(async () => {
            await navigator
                .mediaDevices
                .getUserMedia({audio: true, video: false})
                .then(stream => {
                    audio.srcObject = stream;
                    stream
                        .getTracks()
                        .forEach(track => pc.addTrack(track, stream));
                })
        })();
        var socket = new SockJS("//localhost:8080/ws");
        var stomp = Stomp.over(socket);
        console.log(ROOM_ID);
        pc.onicecandidate = handlerIceCandidate;
        pc.addEventListener("icecandidate", handlerIceCandidate);
        pc.addEventListener('track', async (event) => {
            const [remoteStream] = event.streams;
            remoteVideo.srcObject = remoteStream;
            console.log(remoteVideo.srcObject)
        })
        pc.addEventListener("icegatheringstatechange", ev => console.log(
            "ICE GATHERERING = " + pc.iceGatheringState
        ))
        stomp.connect({}, function (frame) {
            stomp.subscribe("/sub/room/" + ROOM_ID, function (msg) {
                if ((msg.body).includes('join')) {} else {
                    var tmp = JSON.parse(msg.body);
                    console.log(tmp.type);
                    if (tmp.type == "offer") {
                        pc.setRemoteDescription(tmp.data);
                        pc
                            .createAnswer()
                            .then((answer) => pc.setLocalDescription(answer))
                            .then(() => {
                                stomp.send(
                                    "/pub/data",
                                    JSON.stringify({type: 'answer', sender: "counselor1", channelId: ROOM_ID, data: pc.localDescription})
                                )
                            })
                    } else if (tmp.type == "ice") {
                        if (tmp.data) {
                            pc.addIceCandidate(tmp.data);
                            console.log("ICE State: " + pc.iceConnectionState);

                        }
                    }
                }
            })
            stomp.send(
                "/pub/join",
                JSON.stringify({type: 'counselor', sender: "counselor1", channelId: ROOM_ID, data: pc.localDescription})
            );
        })

    }, [])
    return (
        <> 
        <audio id="userAudio" autoPlay="autoPlay" playsInline="playsInline"></audio>
</>
    )
}

export default CounselorTest