import React, { useEffect, useRef } from 'react';
import { Button, Menu, Portal } from './editorComponents';
import { useFocused, useSlate } from 'slate-react';
import { CustomActiveEditor } from './editorEvents';
import { FaBold, FaItalic } from 'react-icons/fa';
import { MdFormatUnderlined } from 'react-icons/md';
import { Editor, Range } from 'slate';
import { css } from '@emotion/css';
import isHotkey from 'is-hotkey';
import { TEXT_ALIGN_TYPES } from '@/lib/constants';
import { IBlockButton, IFormatButton } from '@/types/interface';

const InlineToolbar = () => {
  const ref = useRef<HTMLDivElement | null>();
  const editor = useSlate();
  const inFocus = useFocused();

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el) {
      return;
    }

    if (
      !selection ||
      !inFocus ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      el.removeAttribute('style');
      return;
    }

    const domSelection = global.getSelection() as Selection;
    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    el.style.opacity = '1';
    el.style.top = `${rect.top + window.scrollY - el.offsetHeight}px`;
    el.style.left = `${
      rect.left + window.scrollX - el.offsetWidth / 2 + rect.width / 2
    }px`;
  });

  return (
    <Portal>
      <Menu
        ref={ref}
        className={css`
          padding: 8px 7px 6px;
          position: absolute;
          z-index: 1;
          top: -10000px;
          left: -10000px;
          margin-top: -6px;
          opacity: 0;
          background-color: #222;
          border-radius: 4px;
          transition: opacity 0.75s;
        `}
        onMouseDown={(e: React.MouseEvent) => {
          // prevent toolbar from taking focus away from editor
          e.preventDefault();
        }}
      >
        <FormatButton
          isMarkActive={CustomActiveEditor.isMarkActive}
          toggleMark={CustomActiveEditor.toggleMark}
          format="bold"
          icon={<FaBold />}
        />
        <FormatButton
          isMarkActive={CustomActiveEditor.isMarkActive}
          toggleMark={CustomActiveEditor.toggleMark}
          format="italic"
          icon={<FaItalic />}
        />
        <FormatButton
          isMarkActive={CustomActiveEditor.isMarkActive}
          toggleMark={CustomActiveEditor.toggleMark}
          format="underlined"
          icon={<MdFormatUnderlined />}
        />
      </Menu>
    </Portal>
  );
};

export const BlockButton: React.FC<IBlockButton> = ({
  isBlockActive,
  toggleBlock,
  format,
  icon,
}) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
      )}
      onMouseDown={(event: React.MouseEvent) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {icon}
    </Button>
  );
};

export const MarkButton: React.FC<IFormatButton> = ({
  isMarkActive,
  toggleMark,
  format,
  icon,
}) => {
  const editor = useSlate();
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event: React.MouseEvent) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {icon}
    </Button>
  );
};

export const FormatButton: React.FC<IFormatButton> = ({
  isMarkActive,
  toggleMark,
  format,
  icon,
}) => {
  const editor = useSlate();
  return (
    <Button
      reversed
      active={isMarkActive(editor, format)}
      onClick={() => toggleMark(editor, format)}
    >
      {icon}
    </Button>
  );
};

export default InlineToolbar;
