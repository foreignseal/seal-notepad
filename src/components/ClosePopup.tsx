import { getCurrentWindow } from "@tauri-apps/api/window";

export default function ClosePopup({ onClose }: { onClose: () => void }) {

  return (
    <div className="pop-up" onClick={onClose}>
      <div className="content" onClick={(e) => e.stopPropagation()}>
        <h2 className="google-sans-g100">Are you sure you want to close the app?</h2>
        <div className="buttons">
          <button className="close google-sans-600" onClick={() => getCurrentWindow().close()}>Yes</button>
          <button className="no-close google-sans-600" onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
}
