import { useSettings } from "../systems/settingsSystem";

export default function Settings({ onClose }: { onClose: () => void }) {

  const { settings } = useSettings();

  return (
    <div className="pop-up" onClick={onClose}>
      <div className="content mg75" onClick={(e) => e.stopPropagation()}>
        <div className="settings-layout">
        <div className="sidebar">
            <div className="elements">
                <button className="first google-sans-600">First</button>
                <button className="second google-sans-600">Second</button>
            </div>
            <div className="footer">
                <button className="credits google-sans-600">Credits</button>
            </div>
        </div>
        <div className="settings">
            <h1 className="google-sans-600">Settings</h1>
            <p className="google-sans-g100">Here you can customize your sealNotepad experience. More settings will be added in the future updates!</p>
            <p> {settings.autoSave ? "true" : "false"} </p>
            <p> {settings.recentAmount} recent files </p>
        </div>
        </div>
      </div>
    </div>
  );
}
