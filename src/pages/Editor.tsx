import { useSearchParams } from "react-router-dom";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { useEffect, useState } from "react";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";


function Editor() {
    const [searchParams] = useSearchParams();
    const path = searchParams.get("path");

    const [title, setTitle] = useState("Untitled");

    // Editor
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
            types: ["heading", "paragraph"],
            }),
        ],
        content: "",
    });
    
    // Load File
    useEffect(() => {
        if (!path) return;
        async function loadFile() {
            const file = await readTextFile(path as string);
            const parsed = JSON.parse(file);

            setTitle(parsed.title);
            if (editor) editor.commands.setContent(parsed.content)
        }

        loadFile();
    }, [path, editor]);

    // Ctrl+S
    useEffect(() => {
        const handleSave = async (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                e.preventDefault();

                if (!path || !editor) return;

                await writeTextFile(
                    path,
                    JSON.stringify({
                        title,
                        content: editor.getHTML(),
                    })
                );

                console.log("Saved manually");
            }
        };

        window.addEventListener("keydown", handleSave);
        return () => window.removeEventListener("keydown", handleSave);
    }, [title, editor, path]);

    return (
    <div className="editor-page">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="title-input"
      />

      {/* Toolbar */}
      <div className="toolbar">
        <button onClick={() => editor?.chain().focus().toggleBold().run()}>
          Bold
        </button>

        <button onClick={() => editor?.chain().focus().toggleItalic().run()}>
          Italic
        </button>

        <button onClick={() => editor?.chain().focus().setTextAlign("left").run()}>
          Left
        </button>

        <button onClick={() => editor?.chain().focus().setTextAlign("center").run()}>
          Center
        </button>

        <button onClick={() => editor?.chain().focus().setTextAlign("right").run()}>
          Right
        </button>
      </div>

      {/* Text Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}

export default Editor;