import { getCurrentWindow } from "@tauri-apps/api/window";

export default function ClosePopup({ onClose }: { onClose: () => void }) {

  return (
    <div className="pop-up">
      <div className="content">
        <h2>Are you sure you want to close the app?</h2>
        <div className="buttons">
          <button onClick={() => getCurrentWindow().close()}>Yes</button>
          <button onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
}
