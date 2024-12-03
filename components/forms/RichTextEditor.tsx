import React from "react";
import EditorJS from "@editorjs/editorjs";
import Paragraph from "@editorjs/paragraph";
import Quote from "@editorjs/quote";
import Header from "@editorjs/header";
import Warning from "@editorjs/warning";
import Delimiter from "@editorjs/delimiter";
import Alert from "editorjs-alert";
import List from "@editorjs/list";
import NestedList from "@editorjs/nested-list";
import Checklist from "@editorjs/checklist";
import ImageTool from "@editorjs/image";
import SimpleImage from "@editorjs/simple-image";
import LinkTool from "@editorjs/link";
import AttachesTool from "@editorjs/attaches";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
// import CodeTool from "@editorjs/code";
import CodeTool from "@rxpm/editor-js-code";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import Underline from "@editorjs/underline";

import { KeyboardEvent, useEffect, useRef, useState, useMemo } from "react";

const RichTextEditor = () => {
  const editorRef = useRef();

  const SaveDocument = () => {
    // @ts-ignore
    editor
      .save()
      .then((outputData: any) => {
        console.log("Article data: ", outputData);
      })
      .catch((error: any) => {
        console.log("Saving failed: ", error);
      });
  };

  const editor = new EditorJS({
    onChange: (api: any, event: Event) => {
      SaveDocument();
    },
    holder: "editorjs",
    tools: {
      header: Header,
      quote: Quote,
      paragraph: {
        class: Paragraph,
        inlineToolbar: true,
      },
      warning: {
        class: Warning,
        inlineToolbar: true,
        shortcut: "CMD+SHIFT+W",
        config: {
          titlePlaceholder: "Title",
          messagePlaceholder: "Message",
        },
      },
      delimiter: Delimiter,
      alert: {
        class: Alert,
        inlineToolbar: true,
        shortcut: "CMD+SHIFT+A",
        config: {
          alertTypes: [
            "primary",
            "secondary",
            "info",
            "success",
            "warning",
            "danger",
            "light",
            "dark",
          ],
          defaultType: "primary",
          messagePlaceholder: "Enter something",
        },
      },
      list: {
        class: NestedList,
        inlineToolbar: true,
        config: {
          defaultStyle: "unordered",
        },
      },
      checklist: {
        class: Checklist,
        inlineToolbar: true,
      },
      image: {
        class: ImageTool,
        config: {
          endpoints: {
            byFile: "http://localhost:8008/uploadFile", // Your backend file uploader endpoint
            byUrl: "http://localhost:8008/fetchUrl", // Your endpoint that provides uploading by Url
          },
        },
      },
      linkTool: {
        class: LinkTool,
        config: {
          endpoint: "http://localhost:8008/fetchUrl", // Your backend endpoint for url data fetching,
        },
      },
      attaches: {
        class: AttachesTool,
        config: {
          endpoint: "http://localhost:8008/uploadFile",
        },
      },
      embed: {
        class: Embed,
        config: {
          services: {
            youtube: true,
            coub: true,
          },
        },
      },
      table: {
        class: Table,
        inlineToolbar: true,
        config: {
          rows: 2,
          cols: 3,
        },
      },
      code: {
        class: CodeTool,
        config: {
          modes: {
            js: "JavaScript",
            py: "Python",
            go: "Go",
            cpp: "C++",
            cs: "C#",
            md: "Markdown",
            php: "PHP",
          },
          defaultMode: "go",
        },
      },
      Marker: {
        class: Marker,
        shortcut: "CMD+SHIFT+M",
      },
      inlineCode: {
        class: InlineCode,
        shortcut: "CMD+SHIFT+M",
      },
      underline: Underline,
    },
  });
  return (
    <>
      <div id="editorjs"></div>
    </>
  );
};

export default RichTextEditor;
