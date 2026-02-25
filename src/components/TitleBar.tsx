import { getCurrentWindow } from "@tauri-apps/api/window";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ClosePopup from "./ClosePopup";

function minimizeApp() {
    getCurrentWindow().minimize();
}
function toggleMaximizeApp() {
    getCurrentWindow().toggleMaximize();
}

function TitleBar() {

    // Constants for Close Pop-Up
    const [showClose, setShowClose] = useState(false);

    const navigate = useNavigate();

    function goHome() {
        navigate("/");
    }

    return (
        <>
        <div className="titlebar">
            <button id="home" onClick={goHome}> <div> <img src="/src/assets/seally.png" /> <div className="outfit-300"> sealNotepad</div> </div> </button>

            <div className="window-controls">
                <button id="minimize" onClick={minimizeApp}>
                    {/* lsicon:shell-window-minimize-outline */}
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 16 16"
                    >
                        <path fill="none" stroke="currentColor" d="M3 8h10" strokeWidth="1"/>
                    </svg>
                </button>
                <button id="maximize" onClick={toggleMaximizeApp}>
                    {/* lsicon:shell-window-maximize-outline */}
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 16 16"
                    >
                        <path fill="none" stroke="currentColor" strokeLinejoin="round" d="M3.5 4.5h9v7h-9z" strokeWidth="1"/>
                    </svg>
                </button>
                <button id="close" onClick={() => setShowClose(true)}>
                    {/* lsicon:close-small-outline */}
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 16 16"
                    >
                        <path fill="none" stroke="currentColor" d="m4.5 4.5l7 7m0-7l-7 7" strokeWidth="1"/>
                    </svg>
                </button>
            </div>
        </div>
        {showClose && (<ClosePopup onClose={() => setShowClose(false)} />
      )}
        </>
    );
}

export default TitleBar;