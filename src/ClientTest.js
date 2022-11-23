import React, {useEffect, useState, Component, useRef} from "react";
import axios from "axios";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

var stun_config = {
    'iceServers': [
        {
            "urls": "stun:stun.l.google.com:19302"
        },
        {
            "urls": "stun1:stun.l.google.com:19302"
        },
    ]

}

var mediaConstraints = {
    'OfferToReceiveAudio': true,
    'OfferToReceiveVideo': true
};
var arr = [];

const ClientTest = () => {
    var flag = 0;
    let audio = new MediaStream();
    let remoteVideo = new MediaStream();
    useEffect(() => {
        remoteVideo = document.getElementById('userAudio');
        //audio=document.getElementById('myAudio');
        axios
            .get("http://localhost:8080/consulting/create")
            .then((response) => {
                alert(response.data);

                const pc = new RTCPeerConnection(
                    {configuration: mediaConstraints, stun_config}
                );
                function handlerIceCandidate(e) {
                    if (e.candidate) {
                        stomp.send(
                            "/pub/data",
                            JSON.stringify({type: 'ice', sender: "userName", channelId: response.data, data: e.candidate})
                        );
                        console.log("HANDLER ICE State: " + pc.iceConnectionState);
                    }
                }(async () => {
                    await navigator
                        .mediaDevices
                        .getUserMedia({audio: true, video: false})
                        .then(stream => {
                            stream
                                .getTracks()
                                .forEach(track => pc.addTrack(track, stream));
                        })
                })();
                var socket = new SockJS("//localhost:8080/ws");
                var stomp = Stomp.over(socket);
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
                stomp.connect({}, function () {
                    stomp.subscribe("/sub/room/" + response.data, function (msg) {
                        if ((msg.body).includes('join')) {
                            var tmp2 = (msg.body).substring(0, (msg.body).length - 4);
                            if (tmp2 != "userName") {
                                pc
                                    .createOffer({mandatory: { OfferToReceiveAudio: true, OfferToReceiveVideo: false }})
                                    .then((offer) => pc.setLocalDescription(offer))
                                    .then(() => {
                                        stomp.send(
                                            "/pub/data",
                                            JSON.stringify({type: 'offer', sender: "userName", channelId: response.data, data: pc.localDescription})
                                        );
                                    })
                            }
                        } else {
                            var tmp = JSON.parse(msg.body);
                            if (tmp.type == "answer") {
                                flag=1;
                                pc.setRemoteDescription(tmp.data);
                                console.log("answer!!");
                            } else if (tmp.type == "ice") {
                                if (tmp.data) {
                                    if(flag){
                                        pc.addIceCandidate(tmp.data);
                                        console.log("ICE State: " + pc.iceConnectionState);
                                    }
                                }
                            }
                        }
                    })
                    stomp.send(
                        "/pub/join",
                        JSON.stringify({type: 'client', sender: "userName", channelId: response.data, data: pc.localDescription})
                    );
                })
            })
    }, [])
    return (
        <>
    <audio id="userAudio" autoPlay="autoPlay" playsInline="playsInline"></audio>
</>
    )
}

export default ClientTest