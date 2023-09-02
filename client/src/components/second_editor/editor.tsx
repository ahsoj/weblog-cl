'use client';
import { useCallback, useState } from 'react';
import { Descendant, createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import Element from '@/components/editorElements';
import InlineToolbar, { BlockButton, MarkButton } from './editorToolbar';
import { CustomActiveEditor } from './editorEvents';
import { Toolbar } from './editorComponents';
import { HOTKEYS } from '@/lib/constants';
import { FaBold, FaItalic, FaListUl, FaListOl } from 'react-icons/fa';
import { MdFormatUnderlined, MdFormatQuote } from 'react-icons/md';
import {
  GrTextAlignCenter,
  GrTextAlignLeft,
  GrTextAlignRight,
  GrTextAlignFull,
} from 'react-icons/gr';
import { LuHeading1, LuHeading2, LuHeading3 } from 'react-icons/lu';
import isHotkey from 'is-hotkey';

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'My article body/content ...' }],
  },
];

const ContentEditor = () => {
  const [editor] = useState(() => withReact(createEditor()));
  const renderElement = useCallback((props: any) => <Element {...props} />, []);

  const renderLeaf = useCallback((props: any) => {
    return <Element.Leaf {...props} />;
  }, []);

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Toolbar>
        <MarkButton
          isMarkActive={CustomActiveEditor.isMarkActive}
          toggleMark={CustomActiveEditor.toggleMark}
          format="bold"
          icon={<FaBold />}
        />
        <MarkButton
          isMarkActive={CustomActiveEditor.isMarkActive}
          toggleMark={CustomActiveEditor.toggleMark}
          format="italic"
          icon={<FaItalic />}
        />
        <MarkButton
          isMarkActive={CustomActiveEditor.isMarkActive}
          toggleMark={CustomActiveEditor.toggleMark}
          format="underlined"
          icon={<MdFormatUnderlined />}
        />
        <BlockButton
          isBlockActive={CustomActiveEditor.isBlockActive}
          toggleBlock={CustomActiveEditor.toggleBlock}
          format="heading-one"
          icon={<LuHeading1 />}
        />
        <BlockButton
          isBlockActive={CustomActiveEditor.isBlockActive}
          toggleBlock={CustomActiveEditor.toggleBlock}
          format="heading-two"
          icon={<LuHeading2 />}
        />
        <BlockButton
          isBlockActive={CustomActiveEditor.isBlockActive}
          toggleBlock={CustomActiveEditor.toggleBlock}
          format="heading-three"
          icon={<LuHeading3 />}
        />
        <BlockButton
          isBlockActive={CustomActiveEditor.isBlockActive}
          toggleBlock={CustomActiveEditor.toggleBlock}
          format="block-quote"
          icon={<MdFormatQuote />}
        />
        <BlockButton
          isBlockActive={CustomActiveEditor.isBlockActive}
          toggleBlock={CustomActiveEditor.toggleBlock}
          format="numbered-list"
          icon={<FaListOl />}
        />
        <BlockButton
          isBlockActive={CustomActiveEditor.isBlockActive}
          toggleBlock={CustomActiveEditor.toggleBlock}
          format="bulleted-list"
          icon={<FaListUl />}
        />
        <BlockButton
          isBlockActive={CustomActiveEditor.isBlockActive}
          toggleBlock={CustomActiveEditor.toggleBlock}
          format="left"
          icon={<GrTextAlignLeft />}
        />
        <BlockButton
          isBlockActive={CustomActiveEditor.isBlockActive}
          toggleBlock={CustomActiveEditor.toggleBlock}
          format="center"
          icon={<GrTextAlignCenter />}
        />
        <BlockButton
          isBlockActive={CustomActiveEditor.isBlockActive}
          toggleBlock={CustomActiveEditor.toggleBlock}
          format="right"
          icon={<GrTextAlignRight />}
        />
        <BlockButton
          isBlockActive={CustomActiveEditor.isBlockActive}
          toggleBlock={CustomActiveEditor.toggleBlock}
          format="justify"
          icon={<GrTextAlignFull />}
        />
      </Toolbar>
      <InlineToolbar />
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
        onKeyDown={(event) => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event as any)) {
              event.preventDefault();
              const mark = HOTKEYS[hotkey];
              CustomActiveEditor.toggleMark(editor, mark);
            }
          }
        }}
      />
    </Slate>
  );
};

export default ContentEditor;
