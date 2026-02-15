import { useState } from "react";
import Modal from "../components/Modal";

export default function ClosePopup() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
    >
        <h2>Hello 👋</h2>
        <p>This is a popup!</p>
        <button onClick={() => setIsModalOpen(false)}>
        Close
        </button>
    </Modal>
  );
}
