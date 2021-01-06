import React, { useState, useEffect, Suspense } from 'react'
import  "./Sidebar.css"
import {Avatar, IconButton} from "@material-ui/core"
import { RateReviewOutlined } from "@material-ui/icons"
import SearchIcon from "@material-ui/icons/Search"
import { useSelector } from 'react-redux'
import { selectUser } from "./features/userSlice"
import db, { auth } from './firebase'
import firebase from "firebase"
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

const SidebarChat = React.lazy(() => import('./SidebarChat'));

function Sidebar({darkMode,setDarkMode}) {

    const user = useSelector(selectUser);
    const [chats,setChats]=useState([]);
    const [input,setInput]=useState("");
    const [inputval, setinputval] = useState("");
    const [closedis,setclosedis] = useState("none");
    const [searchdis,setsearchdis] = useState("block");

    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [Promptopen, setPromptOpen] = React.useState(false);

    const Loading=()=>(
        <div style={{
            display:"flex",
            alignItems:"center",
            justifyContent:"flex-start",
            backgroundColor:darkMode? "#1a1919" : "f5f5f5",
            padding:" 17px 20px",
            borderBottom:"1px solid lightgray",
            pointerEvents: "none"
            }} 
            className="sidebarChat loading"
             >
            {/* <h5 style={{color:darkMode? "white" : "#1a1919"}} >Loading...</h5> */}

            <div className="avatar" >
                    <div className="shimmer_wrapper">
                        <div className="shimmer spc_shm"></div>
                    </div>
            </div>
            <div 
            style={{display:"flex",flexDirection:"column"}}
            >
                <div className="heading" >
                    <div className="shimmer_wrapper">
                        <div className="shimmer"></div>
                    </div>
                    </div>
                <div className="last_msg heading" >
                    <div className="shimmer_wrapper">
                        <div className="shimmer"></div>
                    </div>
                </div>
                
        
            </div>

            {/* <div className="shimmer_wrapper">
                <div className="shimmer"></div>
            </div> */}

        </div>
    )

    const handlePromptClickOpen = () => {
        setPromptOpen(true);
    };

    const handlePromptClose = () => {
        setPromptOpen(false);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSignout=()=>{
        setOpen(false);
        auth.signOut()
    }

    useEffect(()=>{
        
            db.collection("chats").orderBy("timestamp","desc").onSnapshot(snapshot=>{
                    setChats(
                        snapshot.docs.map((doc)=>({
                            id: doc.id,
                            data: doc.data(), 
                        })))
            }
             
            )  
  
    },[]);

    const addChat=(e)=>{
        e.preventDefault();
        if(input){
            db.collection('chats').add({
                chatName: input,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
        }
        setPromptOpen(false);
        setInput("")
    }
    
    const getsearchResults=(e)=>{
        e.preventDefault()
        let sidebarChat = document.getElementsByClassName('sidebarChat');

        let inputVal = inputval.toLowerCase();

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        let inputValCaps = capitalizeFirstLetter(inputval);

        Array.from(sidebarChat).forEach(function(element){
            let NameHd = element.getElementsByTagName("h3")[0].innerText;
            let ChatLast = element.getElementsByTagName("p")[0].innerText;

            if(NameHd.includes(inputVal) || ChatLast.includes(inputVal) || NameHd.includes(inputValCaps) || ChatLast.includes(inputValCaps) ){
             element.style.display = "flex";
            }
            else{
             element.style.display = "none";
            }
        });
        IconChange();
    }

      const backhandler=()=>{
        let container = document.getElementsByClassName('sidebarChat');
        Array.from(container).forEach(function(element){
          element.style.display = "flex";
        });
        setinputval("");
        setclosedis("none");
        setsearchdis("block");
    }

    const IconChange=(e)=>{
        setclosedis("block");
        setsearchdis("none")
    }


    const trimmed = input.trim();

    //onClick={()=> auth.signOut() }
    return (
        <div className={darkMode? "side-dark-mode bolo sidebar" : "side-light-mode light-mode sidebar"}>
            <div className="sidebar__header">
                <Avatar 
                onClick={handleClickOpen}
                src={user.photo}
                alt={user.displayName}
                className="sidebar__avatar"
                style={{display: searchdis}}
                />
                <IconButton className="backicon darkcolor" style={{display:closedis}} onClick={backhandler} >
                 <KeyboardBackspaceIcon />
                 </IconButton>
                <div className="sidebar__input">
                    <SearchIcon />
                    <form onSubmit={e=>getsearchResults(e)} >
                    <input 
                        type="text" 
                        placeholder='Search..' 
                        value={inputval} 
                        onChange={e=>setinputval(e.target.value) } 
                        onClick={IconChange}
                        />
                    </form>
                </div>
                <IconButton onClick={handlePromptClickOpen} className='sidebar__inputButton darkcolor' variant='outlined'>
                <RateReviewOutlined />
                </IconButton>
            </div>
            <div className="sidebar__chats">
            <SimpleBar className="scrolldark" style={{ maxHeight: "calc(100vh - 60px )" }}>
            {/* <Loading /> */}
        
            {chats.map(({id, data:{chatName}})=>(
                <Suspense  key={id}  fallback={<Loading />}>
                <SidebarChat key={id} id={id} chatName={chatName} darkMode={darkMode} setDarkMode={setDarkMode} />
                </Suspense>
                ))}
           
            </SimpleBar>
            </div>
            <div>
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
            className="spc"
        >
            <DialogTitle id="responsive-dialog-title">{"Google Account details"}</DialogTitle>
            <DialogContent>
            <DialogContentText>
            <div className="details_cont">
            <Avatar src={user.photo} />
            <div className="more_details">
            <h3 className="details" >{user.displayName}</h3>
                <p> {user.email} </p>
            </div>
            </div>
                
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button className="singout_button" onClick={handleSignout} color="primary">
                Sign Out
            </Button>
            </DialogActions>
        </Dialog>
            </div>
        {/* chat adder */}
        <div>
        <form>
      <Dialog open={Promptopen} onClose={handlePromptClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add a Room</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add a Room in iMessage, please enter the Room name here. 
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Room Name"
            type="text"
            fullWidth
            autoComplete="off"
            value={input}
            onChange={e=>setInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePromptClose} >
            Cancel
          </Button>
          <Button
            onClick={addChat}
            variant="contained" 
            color="primary" 
            disableElevation
            disabled={!trimmed}
            type="submit"
            >
            Add Room
          </Button>
        </DialogActions>
      </Dialog>
      </form>
    </div>
    </div>
    )
}

export default Sidebar
