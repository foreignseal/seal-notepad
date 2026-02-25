import { useSearchParams } from "react-router-dom";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { useEffect, useState } from "react";

import { getSystemFonts, SystemFont } from "tauri-plugin-system-fonts-api";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import { Extension } from "@tiptap/core";


function Editor() {
    const [searchParams] = useSearchParams();
    const path = searchParams.get("path");

    const [title, setTitle] = useState("Untitled");

    const [fonts, setFonts] = useState<SystemFont[]>([]);
    useEffect(() => {
      async function loadFonts() {
        const systemFonts = await getSystemFonts();
        setFonts(systemFonts);
      }
      loadFonts();
    }, []);

    const FontSize = Extension.create({
      name: "fontSize",

      addGlobalAttributes() {
        return [
          {
            types: ["textStyle"],
              attributes: {
                fontSize: {
                  default: null,
                  parseHTML: element => element.style.fontSize,
                  renderHTML: attributes => {
                    if (!attributes.fontSize) return {};
                    return {
                      style: `font-size: ${attributes.fontSize}`,
                    };
                  },
                },
              },
            },
          ];
        },
      });

    // Editor
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            Color,
            FontFamily,
            FontSize,
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
        <button className={editor?.isActive("bold") ? "active" : ""} onClick={() => editor?.chain().focus().toggleBold().run()}>
          Bold
        </button>

        <button className={editor?.isActive("italic") ? "active" : ""} onClick={() => editor?.chain().focus().toggleItalic().run()}>
          Italic
        </button>

        <button className={editor?.isActive("underline") ? "active" : ""} onClick={() => editor?.chain().focus().toggleUnderline().run()}>
          Underline
        </button>

        {/* Font Color */}
        <input type="color" onChange={(e) => editor?.chain().focus().setColor(e.target.value).run()}/>

        {/* Font Family */}
        <select onChange={(e) => editor?.chain().focus().setFontFamily(e.target.value).run()}>
          {fonts.map((font, index) => (
            <option key={index} value={font.fontName}>
            {font.name}
            </option>
          ))}
        </select>

        {/* Font Size */}
        <input type="number" min="8" max="200" defaultValue={14} className="font-size-input" onChange={(e) => editor?.chain().focus().setMark("textStyle", { fontSize: `${e.target.value}px` }).run()}/>

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