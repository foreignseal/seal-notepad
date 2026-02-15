import { Routes, Route } from "react-router-dom";
import TitleBar from "./components/TitleBar";
import Home from "./pages/Home";
import Editor from "./pages/Editor";
import ClosePopup from "./components/ClosePopup";

export default function App() {
  return (
    <>
      <TitleBar />

      <div className="page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/edit" element={<Editor />} />
        </Routes>
      </div>
      <ClosePopup />
    </>
  );
}
