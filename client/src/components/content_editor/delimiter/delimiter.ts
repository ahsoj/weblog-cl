import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core';
import { NodeSelection, TextSelection } from '@tiptap/pm/state';

export interface DelimiterOptions {
  HTMLAttributes: Record<string, any>;
  width: number;
  height: number;
  marginInline: string;
  marginBlock: number;
  boerder: number;
  borderColor: string;
  borderRadius: number;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    // delimiter(attributes?: Partial<DelimiterOptions['HTMLAttributes']>): ReturnType;
    delimiter: {
      /**
       * Add a delimiter with new line
       */
      setDelimiter: () => ReturnType;
    };
  }
}
// <hr className="192 4 marginInline-auto marginBlock-16 borderColor-#777 border-1 borderRadius-4" />

export const Delimiter = Node.create<DelimiterOptions>({
  name: 'delimiter',

  addOptions() {
    return {
      HTMLAttributes: {},
      width: 192,
      height: 4,
      marginInline: 'auto',
      marginBlock: 16,
      boerder: 1,
      borderColor: '#777',
      borderRadius: 4,
    };
  },

  group: 'block',

  parseHTML() {
    return [{ tag: 'span' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  addCommands() {
    return {
      setDelimiter:
        () =>
        ({ chain, state }) => {
          const { $to: $originTo } = state.selection;
          const currentChain = chain();

          if ($originTo.parentOffset === 0) {
            currentChain.insertContentAt($originTo.pos - 1, {
              type: this.name,
            });
          } else {
            currentChain.insertContent({ type: this.name });
          }

          return currentChain
            .command(({ tr, dispatch }) => {
              if (dispatch) {
                const { $to } = tr.selection;
                const posAfter = $to.end();

                if ($to.nodeAfter) {
                  if ($to.nodeAfter.isTextblock) {
                    tr.setSelection(TextSelection.create(tr.doc, $to.pos + 1));
                  } else if ($to.nodeAfter.isBlock) {
                    tr.setSelection(NodeSelection.create(tr.doc, $to.pos));
                  } else {
                    tr.setSelection(TextSelection.create(tr.doc, $to.pos));
                  }
                } else {
                  const node =
                    $to.parent.type.contentMatch.defaultType?.create();

                  if (node) {
                    tr.insert(posAfter, node);
                    tr.setSelection(TextSelection.create(tr.doc, posAfter + 1));
                  }
                }
                tr.scrollIntoView();
              }
              return true;
            })
            .run();
        },
    };
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: /^(?:---|--|___\s|\*\*\*\s)$/,
        type: this.type,
        blockReplace: true,
        addExtraNewline: true,
      }),
    ];
  },
});
