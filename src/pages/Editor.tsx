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

function rgbToHex(color: string) {
  if (!color) return "#cee0da";

  // If already hex, return as-is
  if (color.startsWith("#")) return color;

  const result = color.match(/\d+/g);
  if (!result) return "#cee0da";

  const r = parseInt(result[0]);
  const g = parseInt(result[1]);
  const b = parseInt(result[2]);

  return (
    "#" +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
  );
}

function Editor() {
  const [searchParams] = useSearchParams();
  const path = searchParams.get("path");

  const [title, setTitle] = useState("Untitled");

  const [fonts, setFonts] = useState<SystemFont[]>([]);

  // Toolbar Updates
  const [currentFontSize, setCurrentFontSize] = useState("12px");
  const [currentColor, setCurrentColor] = useState("#cee0da");
  const [currentFontFamily, setCurrentFontFamily] = useState("");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      const systemFonts = await getSystemFonts();
      const unique = [...new Map(systemFonts.map(font => [font.name, font])).values()];
      setFonts(unique);
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
      Color.configure({
        types: ["textStyle"],
      }),
      FontFamily.configure({
        types: ["textStyle"],
      }),
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

  // Editor Updates
  useEffect(() => {
    if (!editor) return;

    const updateToolbar = () => {
      const textStyle = editor.getAttributes("textStyle");

      setCurrentFontSize(textStyle.fontSize || "12px");
      setCurrentColor(rgbToHex(textStyle.color));
      setCurrentFontFamily(textStyle.fontFamily || "");

      setIsBold(editor.isActive("bold"));
      setIsItalic(editor.isActive("italic"));
      setIsUnderline(editor.isActive("underline"));
    };

    editor.on("selectionUpdate", updateToolbar);
    editor.on("transaction", updateToolbar);

    return () => {
      editor.off("selectionUpdate", updateToolbar);
      editor.off("transaction", updateToolbar);
    };
  }, [editor]);


  return (
    <div className="editor-page">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="title-input"
      />

      {/* Toolbar */}
      <div className="toolbar">
        <button className={isBold ? "active" : ""} onClick={() => editor?.chain().focus().toggleBold().run()}>
          Bold
        </button>

        <button className={isItalic ? "active" : ""} onClick={() => editor?.chain().focus().toggleItalic().run()}>
          Italic
        </button>

        <button className={isUnderline ? "active" : ""} onClick={() => editor?.chain().focus().toggleUnderline().run()}>
          Underline
        </button>

        {/* Font Color */}
        <input type="color" value={currentColor} onChange={(e) => editor?.chain().focus().setColor(e.target.value).run()}/>

        {/* Font Family */}
        <select value={currentFontFamily} onChange={(e) => editor?.chain().focus().setFontFamily(e.target.value).run()}>
          <option value="">Default</option>
          {fonts.map((font, index) => (
            <option key={index} value={font.fontName} style={{ fontFamily: font.fontName }}>
            {font.name}
            </option>
          ))}
        </select>

        {/* Font Size */}
        <input type="number" min="4" max="240" value={parseInt(currentFontSize)} className="font-size-input" onChange={(e) => editor?.chain().focus().setMark("textStyle", { fontSize: `${e.target.value}px` }).run()}/>

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