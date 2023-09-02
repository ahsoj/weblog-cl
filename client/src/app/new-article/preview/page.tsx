'use client';
import Renderer from '@/components/editor/renderer';
import React from 'react';

const Preview = () => {
  return (
    <div className="bg-white px-6 py-4 mx-auto items-center max-w-screen-md">
      <Renderer raw={renderContent} />
    </div>
  );
};

export default Preview;

export const renderContent = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: {
        level: 2,
      },
      content: [
        {
          type: 'text',
          text: 'Manage your contacts live 🖖🏻',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'We will build a cool Excel spreadsheet that can be updated live We will build a cool Excel spreadsheet that can be updated live We will build a cool Excel spreadsheet that can be updated live We will build a cool Excel spreadsheet that can be updated live We will build a cool Excel spreadsheet that can be updated live We will build a cool Excel spreadsheet that can be updated live',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'For that, we must use Websockets or Server-Sent Events (SSE). We will build a cool Excel spreadsheet that can be updated live We will build a cool Excel spreadsheet that can be updated live We will build a cool Excel spreadsheet that can be updated live We will build a cool Excel spreadsheet that can be updated live We will build a cool Excel spreadsheet that can be updated live We will build a cool Excel spreadsheet that can be updated live',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'To simplify the process, we will use Supabase real-time. We will build a cool Excel spreadsheet that can be updated live We will build a cool Excel spreadsheet that can be updated live We will build a cool Excel spreadsheet that can be updated live We will build a cool Excel spreadsheet that can be updated live We will build a cool Excel spreadsheet that can be updated live We will build a cool Excel spreadsheet that can be updated live',
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: 'What is Supabase real-time?',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Supabase real-time is pretty neat.',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'It’s basically a Postgres database living up there in the cloud, and when something changes there, it sends an event through WebSockets about the new change. It’s basically a Postgres database living up there in the cloud, and when something changes there, it sends an event through WebSockets about the new change. It’s basically a Postgres database living up there in the cloud, and when something changes there, it sends an event through WebSockets about the new change. It’s basically a Postgres database living up there in the cloud, and when something changes there, it sends an event through WebSockets about the new change.',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'You can learn more about ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://www.geeksforgeeks.org/what-is-web-socket-and-how-it-is-different-from-the-http/',
                target: '_blank',
                class: null,
              },
            },
          ],
          text: 'WebSockets here',
        },
        {
          type: 'text',
          text: '.',
        },
      ],
    },
    {
      type: 'horizontalRule',
    },
    {
      type: 'heading',
      attrs: {
        level: 2,
      },
      content: [
        {
          type: 'text',
          text: 'Let’s set it up 🔥',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Let’s start by initiating a new NextJS project.',
        },
      ],
    },
    {
      type: 'codeBlock',
      attrs: {
        language: null,
      },
      content: [
        {
          type: 'text',
          text: 'npx create-next-app@latest contacts\n',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'We will not use the new app router for that project, so please select that you don’t want it.',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'To use Spreadsheets, let’s install ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'code',
            },
          ],
          text: 'react-spreadsheet',
        },
        {
          type: 'text',
          text: '. It’s a young library, but I have high hopes for it!',
        },
      ],
    },
    {
      type: 'codeBlock',
      attrs: {
        language: null,
      },
      content: [
        {
          type: 'text',
          text: 'npm install react-spreadsheet --save\n',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Let’s open our ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'code',
            },
          ],
          text: 'index.tsx',
        },
        {
          type: 'text',
          text: ' inside of pages and add our data state and react-spreadsheet.',
        },
      ],
    },
    {
      type: 'codeBlock',
      attrs: {
        language: null,
      },
      content: [
        {
          type: 'text',
          text: '// this is comment\n\nimport Spreadsheet from "react-spreadsheet";\n\nexport default function Home() {\n  const [data, setData] = useState<{ value: string }[][]>([]);\n\n    return (\n        <div className="flex justify-center items-stretch">\n            <div className="flex flex-col">\n                <Spreadsheet darkMode={true} data={data} />\n            </div>\n        </div>\n    );\n}\n',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Ok, so not much to see, be we will get there.',
        },
      ],
    },
  ],
};
