import React, { useState, useEffect } from 'react'
import "./SidebarChat.css"
import { Avatar } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import {setChat} from "./features/chatSlice"
import db from "./firebase"
import * as timeago from "timeago.js"

function SidebarChat ({id,chatName,darkMode,setDarkMode}) {

const dispatch =  useDispatch();
const [chatInfo,setChatInfo] = useState([])

    useEffect(()=>{
        db.collection("chats")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp","desc")
        .onSnapshot((snapshot)=>
            setChatInfo(snapshot.docs.map((doc)=> doc.data()))
        )
    },[id]);

    const text = chatInfo[0]?.message || "" ;

    function shorten(text,max) {

        if(text.length > max ){
           return text = text.slice(0,max).split(' ').slice(0, -1).join(' ') + "..."
        }
        else{
            return text
        }
    }

    const focushandler=async()=>{
        const inpt = await document.getElementById("mic_input")
        inpt.focus()
        dispatch(setChat({
            chatId: id,
            chatName: chatName
        }))
    }

    return (
        <div 
        onClick={focushandler}
        className={darkMode? "chat-dark-mode sidebarChat" : "light-chat-mode  sidebarChat"}>
            <Avatar src={chatInfo[0]?.photo} alt={chatInfo[0]?.displayName} />
            <div className="sidebarChat__info" >
                <h3>{chatName}</h3>
                <p className={darkMode? "dark-mode sidebar_p" : "light-mode sidebar_p"} > {shorten(text,38)} </p>
                <small className={darkMode? "dark-mode sidebar_small" : "light-mode sidebar_small"} >{timeago.format( 
                       new Date(chatInfo[0]?.timestamp?.toDate()).toLocaleString()
                       )}
                </small>
            </div>
        </div>
    )
}

export default SidebarChat

