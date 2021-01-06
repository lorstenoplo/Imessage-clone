import React from 'react'
import  "./Imessage.css"
import Sidebar from './Sidebar'
import Chat from "./Chat"

function Imessage() {
    const [darkMode, setDarkMode] = React.useState(getInitialMode());

      
  React.useEffect(() => {
    localStorage.setItem("dark", JSON.stringify(darkMode));
  }, [darkMode]);

  function getInitialMode() {
    const isReturningUser = "dark" in localStorage;
    const savedMode = JSON.parse(localStorage.getItem("dark"));
    const userPrefersDark = getPrefColorScheme();
    // if mode was saved --> dark / light
    if (isReturningUser) {
      return savedMode;
      // if preferred color scheme is dark --> dark
    } else if (userPrefersDark) {
      return true;
      // otherwise --> light
    } else {
      return false;
    }
    // return savedMode || false;
  }

  function getPrefColorScheme() {
    if (!window.matchMedia) return;

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

    return (
        <div className='imessage'>
            <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />
            <Chat darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
    )
}

export default Imessage
