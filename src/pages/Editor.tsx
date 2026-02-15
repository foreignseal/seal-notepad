import { useNavigate } from "react-router-dom";

function Editor() {
    const navigate = useNavigate();

    return (
        <div>
            <button onClick={() => navigate("/")}>
            Go to Home
            </button>
        </div>
    )
}

export default Editor;