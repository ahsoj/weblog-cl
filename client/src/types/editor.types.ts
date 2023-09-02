import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

export type ParagraphElement = {
  type: 'paragraph';
  children: CustomText[];
};

export type HeadingElement = {
  type: 'heading';
  level: number;
  children: CustomText[];
};

export type CodeBlock = {
  type: 'code';
  children: CustomText[];
};

export type LinkElement = {
  type: 'link';
  url: string;
  children: CustomText[];
};

export type QuoteElement = {
  type: 'quote';
  children: CustomElement[];
};

export type CustomElement = ParagraphElement | HeadingElement | CodeBlock;

export type FormattedText = { text: string; bold?: true };

export type CustomText = FormattedText;

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
