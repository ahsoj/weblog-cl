import { Editor, Transforms, Element as El } from 'slate';
import { CustomEditor, CustomElement } from '@/types/editor.types';
import { LIST_TYPES, TEXT_ALIGN_TYPES } from '@/lib/constants';

export const CustomActiveEditor = {
  isBoldMarkactive(editor: CustomEditor) {
    const marks = Editor.marks(editor);
    return marks ? marks.bold === true : false;
  },
  isCodeBlockActive(editor: CustomEditor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.type === 'code',
    });
    return !!match;
  },
  isMarkActive(editor: CustomEditor, format: string) {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  },
  isBlockActive(editor: CustomEditor, format: string, blockType = 'type') {
    const { selection } = editor;
    if (!selection) return false;

    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: (n) =>
          !Editor.isEditor(n) && El.isElement(n) && n[blockType] === format,
      })
    );

    return !!match;
  },
  toggleBoldMark(editor: CustomEditor) {
    const isActive = CustomActiveEditor.isBoldMarkactive(editor);
    if (isActive) {
      Editor.removeMark(editor, 'bold');
    } else {
      Editor.addMark(editor, 'bold', true);
    }
  },
  toggleCodeBlock(editor: CustomEditor) {
    const isActive = CustomActiveEditor.isCodeBlockActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? 'paragraph' : 'code' },
      { match: (n) => Editor.isBlock(editor, n as CustomElement) }
    );
  },
  toggleMark(editor: CustomEditor, format: string) {
    const isActive = CustomActiveEditor.isMarkActive(editor, format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  },
  toggleBlock(editor: CustomEditor, format: string) {
    const isActive = CustomActiveEditor.isBlockActive(
      editor,
      format,
      TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
    );
    const isList = LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) &&
        El.isElement(n) &&
        LIST_TYPES.includes(n.type) &&
        !TEXT_ALIGN_TYPES.includes(format),
      split: true,
    });
    let newProperties: Partial<El>;
    if (TEXT_ALIGN_TYPES.includes(format)) {
      newProperties = {
        align: isActive ? undefined : format,
      };
    } else {
      newProperties = {
        type: isActive ? 'paragraph' : isList ? 'list-item' : format,
      };
    }
    Transforms.setNodes<El>(editor, newProperties);

    if (!isActive && isList) {
      const block = { type: format, children: [] };
      Transforms.wrapNodes(editor, block);
    }
  },
};
