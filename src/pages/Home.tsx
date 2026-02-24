import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { useEffect } from "react";
import Settings from "../components/Settings";
import { useSettings } from "../systems/settingsSystem";

async function createNewFile(navigate: any) {
  const filePath = await save({
    filters: [{
      name: "Seal Notes",
      extensions: ["seal"]
    }]
  });

  if (!filePath) return;

  const initialContent = JSON.stringify({
    "title": "Untitled",
    "content": "<p>Hello world</p>"
  });

  await writeTextFile(filePath, initialContent);

  // Recent Files
  const stored = JSON.parse(localStorage.getItem("recentFiles") || "[]");

  if (!stored.includes(filePath)) {
    localStorage.setItem(
      "recentFiles",
      JSON.stringify([filePath, ...stored])
    );
  }

  navigate(`/edit?path=${encodeURIComponent(filePath)}`);
}

function Home() {
    const { settings } = useSettings();
    
    const navigate = useNavigate();
    const [showComponent, setShowComponent] = useState(false);

    const [recentFiles, setRecentFiles] = useState<string[]>([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("recentFiles") || "[]");
        setRecentFiles(stored.slice(0, settings.recentAmount));
    }, []);

    return (
        <>
        <div>
            <div className="home-page">
                <img src="/src/assets/home-seal.png"/>
                <h1 className="google-sans-600">No seally notes around!</h1>
                <a className="google-sans-g100" onClick={() => createNewFile(navigate)}>Let's create a new one!</a>
                {recentFiles.length > 0 && (
                    <div className="recent-files">
                        <h2 className="google-sans-600">Recent Files</h2>

                            {recentFiles.map((file) => (
                                <div
                                    key={file}
                                    className="recent-item"
                                    onClick={() =>
                                        navigate(`/edit?path=${encodeURIComponent(file)}`)
                                    }
                                >
                                    {file.split("\\").pop()}
                                </div>
                            ))}
                    </div>
                )}
            </div>
            <button className="bottom" onClick={() => setShowComponent(true)}>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M18 4a1 1 0 1 0-2 0v1H4a1 1 0 0 0 0 2h12v1a1 1 0 1 0 2 0V7h2a1 1 0 1 0 0-2h-2zM4 11a1 1 0 1 0 0 2h2v1a1 1 0 1 0 2 0v-1h12a1 1 0 1 0 0-2H8v-1a1 1 0 0 0-2 0v1zm-1 7a1 1 0 0 1 1-1h12v-1a1 1 0 1 1 2 0v1h2a1 1 0 1 1 0 2h-2v1a1 1 0 1 1-2 0v-1H4a1 1 0 0 1-1-1"/></g></svg>
                    <div className="google-sans-g100">Settings</div>
                </div>
            </button>
        </div>
        {showComponent && (<Settings onClose={() => setShowComponent(false)} />)}
        </>
    )
}

export default Home;