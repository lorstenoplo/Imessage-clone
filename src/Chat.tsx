import React, { useState, useEffect } from "react";
import "./Chat.css";
import { IconButton } from "@material-ui/core";
import MicNoneIcon from "@material-ui/icons/MicNone";
import Message from "./Message";
import { useSelector } from "react-redux";
import { selectChatName, selectChatId } from "./features/chatSlice";
import db from "./firebase";
import firebase from "firebase";
import { selectUser } from "./features/userSlice";
import FlipMove from "react-flip-move";
import CloseIcon from "@material-ui/icons/Close";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import { useRef } from "react";

function Chat({ darkMode, setDarkMode }) {
  const [input, setInput] = useState("");
  const [startmsg, setstartmsg] = useState("");
  const [waitmsg, setwaitmsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [color, setColor] = useState("gray");
  const [disabled, setdisabled] = useState(false);
  const [inputdis, setinputdis] = useState("block");
  const [listendis, setlistendis] = useState("none");
  const user = useSelector(selectUser);
  const chatName = useSelector(selectChatName);
  const chatId = useSelector(selectChatId);
  const inpt = document.getElementById("mic_input");

  const bottom = useRef();
  console.log(bottom);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  var final_transcript = "";
  recognition.interimResults = true;
  recognition.continuous = true;

  const onResult = () => {};

  const textToSpeech = () => {
    setTimeout(() => {
      recognition.start();
    }, 200);
    setColor("rgba(234,67,53,1)");
    setdisabled(true);
    setinputdis("none");
    setlistendis("block");
    setstartmsg("Speak Now");
    setInput("");

    // recognition.onstart=function(e){
    //     if(startmsg!=="Stopping..."){
    //         setTimeout(()=>{

    //                 setstartmsg("Listening....")

    //         },2000)
    //     }
    // }

    recognition.onresult = function onResult(event) {
      var interim_transcript = "";
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final_transcript += event.results[i][0].transcript;
          setInput(final_transcript);
        } else {
          interim_transcript += event.results[i][0].transcript;
          setInput(interim_transcript);
        }
      }
    };
    recognition.addEventListener("result", onResult);
    recognition.onend = function () {
      setColor(darkMode ? "gray" : "gray");
      setTimeout(() => {
        setdisabled(false);
      }, 400);
      setTimeout(() => {
        setinputdis("block");
        setlistendis("none");
        setwaitmsg("");
        if (inpt) {
          inpt.focus();
        }
      }, 800);
    };
    // recognition.onspeechend=function(){
    //     setTimeout(()=>{
    //         setdisabled(false)
    //     },400)
    //     setTimeout(()=>{
    //         setinputdis("block")
    //         setlistendis("none")
    //     },1000)
    //     if(inpt){
    //         inpt.focus()
    //     }
    // }
    recognition.addEventListener("error", function (event) {
      console.log("Speech recognition error detected: " + event.error);
    });
  };

  useEffect(() => {
    if (chatId) {
      db.collection("chats")
        .doc(chatId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) =>
          setMessages(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          )
        );
    }
  }, [chatId]);

  const sendMessage = (e) => {
    e.preventDefault();

    if (chatId) {
      db.collection("chats").doc(chatId).collection("messages").add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: input,
        uid: user.uid,
        photo: user.photo,
        email: user.email,
        displayName: user.displayName,
      });
      setInput("");
      bottom.current.scrollIntoView();
    }
  };

  const trimmed = input.trim();
  const stopbtn = document.getElementById("stopbtn");
  if (stopbtn) {
    stopbtn.addEventListener("click", () => {
      recognition.abort();
      setInput("");
      setstartmsg("Stopping...");

      setTimeout(() => {
        if (inpt) {
          inpt.focus();
        }
      }, 1000);
    });
  }
  const okbtn = document.getElementById("okbtn");
  if (okbtn) {
    okbtn.addEventListener("click", () => {
      setwaitmsg("Wait...");
      recognition.stop();
      if (inpt) {
        inpt.focus();
      }
    });
  }

  function keyhandler(event) {
    var key = event.keyCode;
    //space pressed
    if (!trimmed) {
      if (key === 32) {
        //space
        event.preventDefault();
      }
    }
  }

  return (
    <div className="chat">
      <div
        className={
          darkMode
            ? "head-dark-mode chat__header"
            : "head-light-mode chat__header"
        }
      >
        <h4>
          To: <span className="chat_name">{chatName}</span>
        </h4>
        <div className="toggle__container">
          <span
            style={{
              color: darkMode ? "grey" : "orange",
              marginBottom: "2px",
              marginRight: "2px",
            }}
          >
            ☀︎
          </span>
          <span className="toggle">
            <input
              checked={darkMode}
              onChange={() => setDarkMode((prevMode) => !prevMode)}
              id="checkbox"
              className="checkbox"
              type="checkbox"
              style={{
                backgroundColor: darkMode ? "orange" : "white",
                borderColor: darkMode ? "orange" : "lightgray",
              }}
            />
            <label
              htmlFor="checkbox"
              style={{ backgroundColor: darkMode ? "white" : "#ADB5BD" }}
            />
          </span>
          <span
            style={{
              color: darkMode ? "yellow" : "grey",
              marginLeft: "6px",
              marginBottom: "2px",
            }}
          >
            ☾
          </span>
          {/* <button onClick={() => setDarkMode(prevMode => !prevMode)}>
          Toggle
        </button> */}
        </div>
      </div>

      <div
        className={
          darkMode
            ? "dark-mode-chat-m dark-mode chat__messages"
            : "light-mode chat__messages"
        }
      >
        <FlipMove>
          {messages.map(({ id, data }) => (
            <Message key={id} contents={data} darkMode={darkMode} />
          ))}
        </FlipMove>
        <div key="bla" ref={bottom}>
          nice
        </div>
      </div>

      <div
        className={
          darkMode
            ? "input-dark-mode chat__input"
            : "input-light-mode chat__input"
        }
      >
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="iMessage"
            id="mic_input"
            className="darkinput"
            style={{ display: inputdis }}
            onKeyDown={keyhandler}
          />
          <p className="listen" style={{ display: listendis }}>
            {input ? (waitmsg ? waitmsg : input) : startmsg}
          </p>
          <button disabled={!trimmed} onClick={sendMessage} type="submit">
            send
          </button>
        </form>

        <IconButton
          id="mic_button"
          className="mic_button"
          onClick={textToSpeech}
          disabled={disabled || !chatId}
          style={{ display: inputdis, color: color }}
          key="1"
        >
          <MicNoneIcon className="chat_mic" />
        </IconButton>

        <IconButton key="2" style={{ display: listendis }} id="stopbtn">
          <CloseIcon className="closeicon" />
        </IconButton>
        <IconButton key="3" style={{ display: listendis }} id="okbtn">
          <CheckRoundedIcon className="closeicon" />
        </IconButton>
      </div>
    </div>
  );
}

export default Chat;
