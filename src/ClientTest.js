import React, {useEffect, useState, Component, useRef} from "react";
import axios from "axios";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import {useNavigate} from "react-router-dom";

async function getConnectedDevices(type) {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === type)
}

// Open camera with at least minWidth and minHeight capabilities
async function openCamera(cameraId, minWidth, minHeight) {
    const constraints = {
        'audio': {'echoCancellation': true},
        'video': {
            'deviceId': cameraId,
            'width': {'min': minWidth},
            'height': {'min': minHeight}
            }
        }

    return await navigator.mediaDevices.getUserMedia(constraints);
}

const cameras = getConnectedDevices('videoinput');
if (cameras && cameras.length > 0) {
    // Open first available video camera with a resolution of 1280x720 pixels
    const stream = openCamera(cameras[0].deviceId, 1280, 720);
}

var stun_config ={
    'iceServers':[
        {"url":"stun:stun.l.google.com:19302"},
    ]
}
const ClientTest = () => {
    let audio = new Audio();
    useEffect(()=>{
        axios.get("http://localhost:8080/consulting/create")
        .then((response)=>{
            alert(response.data);

        const pc=new RTCPeerConnection(stun_config);
        (async() => {
            await navigator.mediaDevices.getUserMedia({audio:true, video:false})
            .then(stream=>{
                audio.srcObject=stream;
                stream.getTracks().forEach(track=>pc.addTrack(track,stream));
            })
        })();
        var socket= new SockJS("//localhost:8080/ws");
        var stomp = Stomp.over(socket);
        stomp.connect({},function(){
            stomp.subscribe("/sub/room/"+response.data,function(msg){
                if((msg.body).includes('join')){
                    var tmp2=(msg.body).substring(0,(msg.body).length-4);
                    if(tmp2!="userName"){
                        pc.createOffer()
                        .then((offer)=> pc.setLocalDescription(offer))
                        .then(()=>{
                            stomp.send("/pub/data",JSON.stringify({type:'offer', sender:"userName", channelId:response.data, data:JSON.stringify(pc.localDescription)}));
                        })
                    }
                }
                else{
                var tmp=JSON.parse(msg.body);
                if(tmp.type=="answer"){
                    var sdp=JSON.parse(tmp.data);
                    pc.setRemoteDescription(sdp);
                    stomp.send("/pub/data",JSON.stringify({type:'ice', sender:"userName", channelId:response.data, data:"client ice"}));
                }
                else if(tmp.type=="ice"){
                    console.log(pc.localDescription);
                    console.log(pc.currentRemoteDescription);
                    stomp.send("/pub/success");
                }
            }
            })
            stomp.send("/pub/join",JSON.stringify({type:'client', sender:"userName", channelId:response.data, data:"dkdk"}));
        })
    })
    },[])
    return (
        <>
        <p>Hello!</p>
        </>
    )
}

export default ClientTest