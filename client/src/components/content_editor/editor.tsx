'use client';

import './hljs.module.css';
import { useAppDispatch } from '@/utils/redux/hooks';
import Document from '@tiptap/extension-document';
import Placeholder from '@tiptap/extension-placeholder';
import ListItem from '@tiptap/extension-list-item';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import OrderedList from '@tiptap/extension-ordered-list';
// import Underline from '@tiptap/extension-underline';
import BulletList from '@tiptap/extension-bullet-list';
import Heading from '@tiptap/extension-heading';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Delimiter from './delimiter';

import {
  EditorContent,
  ReactNodeViewRenderer,
  useEditor,
  BubbleMenu,
  FloatingMenu,
} from '@tiptap/react';
import type { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useCallback } from 'react';
import {
  BsTypeBold,
  BsTypeItalic,
  BsTypeUnderline,
  BsListUl,
  BsListOl,
  BsLink45Deg,
  BsImage,
} from 'react-icons/bs';
import { TbTextSize } from 'react-icons/tb';
import { PiCodeBlockLight } from 'react-icons/pi';
import { BiCodeAlt, BiSolidQuoteAltRight } from 'react-icons/bi';
import { GrRedo, GrUndo } from 'react-icons/gr';
// import {
//   CiTextAlignRight,
//   CiTextAlignLeft,
//   CiTextAlignJustify,
//   CiTextAlignCenter,
// } from 'react-icons/ci';
import { Popover } from '@headlessui/react';
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';

import { lowlight } from 'lowlight';
import CodeBlockComponent from './codeblockComponent';
import { setArticleContent, setNewTitle } from '@/utils/redux/toolKitSlice';

lowlight.registerLanguage('html', html);
lowlight.registerLanguage('css', css);
lowlight.registerLanguage('js', js);
lowlight.registerLanguage('ts', ts);

const CustomDocument = Document.extend({
  content: 'heading block*',
});

{
  /* <Popover className="relative">
        <Popover.Button>TA</Popover.Button>

        <Popover.Panel className="absolute z-10">
          <div className="block gap-4 shadow-md p-0.5 border bg-white border-slate-300">
            <button
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={
                editor.isActive({ textAlign: 'left' }) ? 'text-green-500' : ''
              }
            >
              <CiTextAlignLeft fontSize={25} />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().setTextAlign('center').run()
              }
              className={
                editor.isActive({ textAlign: 'center' }) ? 'text-green-500' : ''
              }
            >
              <CiTextAlignCenter fontSize={25} />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={
                editor.isActive({ textAlign: 'right' }) ? 'text-green-500' : ''
              }
            >
              <CiTextAlignRight fontSize={25} />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().setTextAlign('justify').run()
              }
              className={
                editor.isActive({ textAlign: 'justify' }) ? 'text-green-500' : ''
              }
            >
              <CiTextAlignJustify fontSize={25} />
            </button>
          </div>
        </Popover.Panel>
      </Popover> */
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = global.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor
      ?.chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run();
  }, [editor]);

  const addImage = useCallback(() => {
    const url = global.prompt('URL');
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full sticky transition-all mx-auto justify-center items-center top-0 z-10 mb-4 bg-slate-100">
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x">
          <div className="flex items-center space-x-1 sm:pr-4">
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              disabled={
                !editor.can().chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={`${
                editor.isActive('heading', { level: 3 }) ? 'text-green-500' : ''
              } p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100`}
            >
              <TbTextSize fontSize={20} />
            </button>
            {/* <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              className={`${
                editor.isActive('bold') ? 'text-green-500' : ''
              } p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100`}
            >
              <BsTypeBold fontSize={25} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              className={`${
                editor.isActive('italic') ? 'text-green-500' : ''
              } p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100`}
            >
              <BsTypeItalic fontSize={25} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              disabled={!editor.chain().focus().toggleUnderline().run()}
              className={`${
                editor.isActive('underline') ? 'text-green-500' : ''
              } p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100`}
            >
              <BsTypeUnderline fontSize={25} />
            </button> */}
            <button
              type="button"
              onClick={setLink}
              // disabled={!editor.chain().focus().toggleUnderline().run()}
              className={`${
                editor.isActive('link') ? 'text-green-500' : ''
              } p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100`}
            >
              <BsLink45Deg fontSize={20} />
            </button>
            <button
              type="button"
              onClick={addImage}
              // disabled={!editor.chain().focus().toggleUnderline().run()}
              className={`${
                editor.isActive('link') ? 'text-green-500' : ''
              } p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100`}
            >
              <BsImage fontSize={20} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCode().run()}
              disabled={!editor.can().chain().focus().toggleCode().run()}
              className={`${
                editor.isActive('code') ? 'text-green-500' : ''
              } p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100`}
            >
              <BiCodeAlt fontSize={25} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
              className={`${
                editor.isActive('codeBlock') ? 'text-green-500' : ''
              } p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100`}
            >
              <PiCodeBlockLight fontSize={25} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              disabled={!editor.can().chain().focus().toggleBlockquote().run()}
              className={`${
                editor.isActive('blockquote') ? 'text-green-500' : ''
              } p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100`}
            >
              <BiSolidQuoteAltRight fontSize={25} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              disabled={!editor.can().chain().focus().toggleBulletList().run()}
              className={`${
                editor.isActive('bulletList') ? 'text-green-500' : ''
              } p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100`}
            >
              <BsListUl fontSize={20} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              disabled={!editor.can().chain().focus().toggleOrderedList().run()}
              className={`${
                editor.isActive('orderedList') ? 'text-green-500' : ''
              } p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100`}
            >
              <BsListOl fontSize={20} />
            </button>
          </div>
        </div>
        <div className="flex items-center divide-gray-200 sm:divide-x">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100"
          >
            <GrUndo fontSize={25} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100"
          >
            <GrRedo fontSize={25} />
          </button>
        </div>
      </div>
    </div>
  );
};

const FloatingBar = ({ editor }: { editor: Editor | null }) => {
  return (
    <>
      {editor && (
        <BubbleMenu
          className="bubble-menu bg-slate-200 py-1 px-2 rounded"
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`${
              editor.isActive('bold') ? 'text-green-500' : ''
            } p-1 text-slate-400 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100`}
          >
            <BsTypeBold fontSize={20} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`${
              editor.isActive('italic') ? 'text-green-500' : ''
            } p-1 text-slate-400 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100`}
          >
            <BsTypeItalic fontSize={20} />
          </button>
          {/* <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.chain().focus().toggleUnderline().run()}
            className={`${
              editor.isActive('underline') ? 'text-green-500' : ''
            } p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100`}
          >
            <BsTypeUnderline fontSize={25} />
          </button> */}
        </BubbleMenu>
      )}

      {editor && (
        <FloatingMenu
          className="bg-slate-200 rounded-md"
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          <div className="p-2 flex gap-4 items-center">
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              disabled={
                !editor.can().chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={
                editor.isActive('heading', { level: 3 }) ? 'text-green-500' : ''
              }
            >
              <TbTextSize fontSize={20} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              disabled={!editor.can().chain().focus().toggleBulletList().run()}
              className={editor.isActive('bulletList') ? 'text-green-500' : ''}
            >
              <BsListUl fontSize={20} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              disabled={!editor.can().chain().focus().toggleOrderedList().run()}
              className={editor.isActive('orderedList') ? 'text-green-500' : ''}
            >
              <BsListOl fontSize={20} />
            </button>
          </div>
        </FloatingMenu>
      )}
    </>
  );
};

export default function CustomEditor() {
  const dispatch = useAppDispatch();
  const editor = useEditor({
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      if (
        json.content &&
        json?.content[0].content &&
        json?.content[0].content[0].text
      ) {
        dispatch(setNewTitle(json?.content[0].content[0].text));
        json?.content.shift();
      } else {
        dispatch(setNewTitle('Untitled'));
      }
      dispatch(setArticleContent(json));
    },
    extensions: [
      TextStyle.configure({ types: [ListItem.name] }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      CustomDocument,
      // Underline,
      BulletList,
      OrderedList,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Delimiter,
      Heading.configure({
        levels: [3],
      }),
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        document: false,
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return 'What’s the title?';
          }

          return 'Can you add some further context?';
        },
        // placeholder: 'Write your article content ...',
      }),
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({ lowlight }),
    ],
    editorProps: {
      attributes: {
        class:
          'prose focus:outline-none px-0 prose-xl mx-auto prose-slate prose-h1:text-black prose-h2:text-black prose-h3:text-black',
      },
    },
    // content: `
    //   <h1>It'll always a heading ...</h1>
    //   <p>If you pass a custom document. That's the beauty of having full control over the schema.</p>
    // `,
  });

  return (
    <div>
      <MenuBar editor={editor} />
      <FloatingBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
