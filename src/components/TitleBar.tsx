import { getCurrentWindow } from "@tauri-apps/api/window";

const appWindow = getCurrentWindow();

function closeApp() {
    getCurrentWindow().close();
}
function minimizeApp() {
    getCurrentWindow().minimize();
}
function toggleMaximizeApp() {
    getCurrentWindow().toggleMaximize();
}

function TitleBar() {

    return (
        <div className="titlebar">
            <button id="home"> <div> <img src="/src/assets/seal.png" /> <div className="outfit-300"> sealNotepad</div> </div> </button>

            <div className="window-controls">
                <button id="minimize" onClick={minimizeApp}>
                    {/* lsicon:shell-window-minimize-outline */}
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 16 16"
                    >
                        <path fill="none" stroke="currentColor" d="M3 8h10" stroke-width="1"/>
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
                        <path fill="none" stroke="currentColor" stroke-linejoin="round" d="M3.5 4.5h9v7h-9z" stroke-width="1"/>
                    </svg>
                </button>
                <button id="close" onClick={closeApp}>
                    {/* lsicon:close-small-outline */}
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 16 16"
                    >
                        <path fill="none" stroke="currentColor" d="m4.5 4.5l7 7m0-7l-7 7" stroke-width="1"/>
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default TitleBar;