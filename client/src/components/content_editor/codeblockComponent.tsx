import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import React from 'react';

export default function CodeBlockComponent({
  node: {
    attrs: { language: defaultLanguage },
  },
  updateAttributes,
  extension,
}: {
  updateAttributes: any;
  extension: any;
  node: any;
}) {
  return (
    <NodeViewWrapper className="relative">
      <select
        contentEditable={false}
        className="absolute right-2 top-2"
        defaultValue={defaultLanguage}
        onChange={(event) => updateAttributes({ language: event.target.value })}
      >
        <option value="null">auto</option>
        <option disabled>—</option>
        {extension.options.lowlight
          .listLanguages()
          .map((lang: string, index: number) => (
            <option key={index} value={lang}>
              {lang}
            </option>
          ))}
      </select>
      <pre>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
}
