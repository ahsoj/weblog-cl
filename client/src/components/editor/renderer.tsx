// Option 1: Browser + server-side
import React, { ErrorInfo } from 'react';
import Image from 'next/image';
import { ThemeProvider } from '@emotion/react';
import defaultTheme from 'dante3/package/esm/styled/themes/default';
import EditorContainer from 'dante3/package/esm/styled/base';
import { ImageRenderer } from 'dante3/package/esm/blocks/image';
import { AudioRecorderRenderer } from 'dante3/package/esm/blocks/audioRecorder';
import { FileBlockRenderer } from 'dante3/package/esm/blocks/file';
import { EmbedBlockRenderer } from 'dante3/package/esm/blocks/embed';
import { VideoBlockRenderer } from 'dante3/package/esm/blocks/video';
// import { VideoRecorderRenderer } from 'dante3/package/esm/blocks/videoRecorder';
import { DividerBlockRenderer } from 'dante3/package/esm/blocks/divider';
import { MdContentCopy } from 'react-icons/md';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import highlighTheme from '@/theme/highlighter_heme';
import { BsPersonCheck, BsPersonAdd } from 'react-icons/bs';
import { twmesh } from '@/utils/twmesh';
import { UserInfo } from '@/types/interface';
import { Article } from '@/types/types';
import { enqueueSnackbar } from 'notistack';
// import { notsigninToast } from '@/app/page';

export const notsigninToast = () => {
  return (
    <button className="px-4 rounded-md text-indigo-600 border border-indigo-600 outline-none py-2">
      Signin
    </button>
  );
};

type RendererProps = {
  message?: any;
  domain?: string;
  raw: any;
  html?: string;
  theme?: any;
  title?: string;
  imageUrl?: string;
  ifollowed?: any;
  article?: Article;
  xfollows?: any;
  user?: UserInfo | null;
};

function Renderer({
  raw,
  html,
  theme,
  domain,
  title,
  imageUrl,
  ifollowed,
  article,
  xfollows,
  user,
}: RendererProps) {
  const convertNodeToElement = (node: any) => {
    switch (node.type) {
      case 'heading':
        switch (node.attrs.level) {
          case 1:
            return (
              <h1 className="font-black prose-h1">
                {traverseNodes(node.content)}
              </h1>
            );
          case 2:
            return (
              <h2 className="mt-4 font-bold prose-h2">
                {traverseNodes(node.content)}
              </h2>
            );
          case 3:
            return (
              <h3 className="mt-4 font-semibold prose-h3">
                {traverseNodes(node.content)}
              </h3>
            );
        }
      case 'blockquote':
        return (
          <blockquote className="italic prose-blockquote:italic ml-4 border-slate-200 text-base">
            {traverseNodes(node.content)}
          </blockquote>
        );
      case 'ImageBlock':
        return (
          <ImageRenderer blockKey={node.id} data={node.attrs} domain={domain} />
        );
      case 'AudioRecorderBlock':
        return (
          <AudioRecorderRenderer
            blockKey={node.id}
            data={node.attrs}
            domain={domain}
          />
        );
      case 'DividerBlock':
        return <DividerBlockRenderer blockKey={node.id} data={node.attrs} />;
      case 'EmbedBlock':
        return <EmbedBlockRenderer blockKey={node.id} data={node.attrs} />;
      case 'VideoBlock':
        return <VideoBlockRenderer blockKey={node.id} data={node.attrs} />;
      case 'FileBlock':
        return (
          <FileBlockRenderer
            blockKey={node.id}
            data={node.attrs}
            domain={domain}
          />
        );
      // case 'VideoRecorder':
      //   return (
      //     <VideoRecorderRenderer
      //       blockKey={node.id}
      //       data={node.attrs}
      //       domain={domain}
      //     />
      //   );

      case 'paragraph':
        return (
          <p className="" key={node.id}>
            {traverseNodes(node.content)}
          </p>
        );
      case 'bulletList':
        return (
          <ul className="" key={node.id}>
            {traverseNodes(node.content)}
          </ul>
        );
      case 'listItem':
        return (
          <li className="" key={node.id}>
            {traverseNodes(node.content)}
          </li>
        );
      case 'codeBlock':
        const output_code = traverseNodes(node.content)[0]?.props?.children;
        return (
          // <pre className="" key={node.id}>
          //   {traverseNodes(node.content)}
          // </pre>
          <div className="group relative">
            <MdContentCopy className="absolute hidden group-hover:inline-flex text-slate-400 right-3 top-3 hover:text-white hover:cursor-pointer" />
            <SyntaxHighlighter
              key={node.id}
              language="javascript"
              style={highlighTheme}
            >
              {output_code ? output_code : ''}
            </SyntaxHighlighter>
          </div>
        );
      case 'text':
        const textElement = (
          <React.Fragment key={node.id}>{node.text}</React.Fragment>
        );

        if (node.marks && node.marks.length > 0) {
          return node.marks.reduce((element: any, mark: any) => {
            return handleMark(element, mark, node);
          }, textElement);
        }

        return textElement;

      // Add cases for other node types as needed
      default:
        console.warn('no handler for node', node);
        return null;
    }
  };

  const handleMark = (element: any, mark: any, node: any) => {
    switch (mark.type) {
      case 'textStyle':
        const { color } = mark.attrs;
        return (
          <span key={node.id} style={{ color }}>
            {element}
          </span>
        );
      case 'bold':
        return (
          <strong className="text-base font-semibold" key={node.id}>
            {element}
          </strong>
        );
      case 'italic':
        return <em key={node.id}>{element}</em>;
      case 'code':
        return (
          <code key={node.id} className="text-black bg-slate-200 p-0.5">
            {element}
          </code>
        );
      case 'link':
        const { href, target } = mark.attrs;
        return (
          <a
            className="text-blue-500 hover:underline"
            target={target}
            rel="noopener noreferrer nofollow"
            href={href}
          >
            {element}
          </a>
        );
      default:
        console.warn('no handler for mark', mark);
        return element;
    }
  };

  const traverseNodes = (nodes: any) => {
    if (!nodes) return null;
    return nodes.map((node: any) => {
      // console.log(node);
      return convertNodeToElement(node);
    });
  };

  const renderedContent = traverseNodes(raw.content);

  return (
    <ThemeProvider theme={theme || defaultTheme}>
      <EditorContainer>
        {/* <ErrorBoundary> */}
        <article className="prose prose-xl mx-auto prose-neutral prose-h1:text-black prose-p:text-lg prose-h2:text-black prose-h3:text-black prose-h3:text-xl sm:prose-h3:text-2xl">
          <h1 className="text-3xl sm:text-5xl mb-2 lead font-black">{title}</h1>
          <div className="flex w-full py-1 bg-white sticky top-0 z-50 border-y border-gray-200 items-center justify-between">
            <div>
              <span className="px-4 grow items-center flex pt-1 flex-shrink-0 text-sm text-gray-500">
                {article?.author?.profileUrl ? (
                  <Image
                    width={32}
                    height={32}
                    className="rounded-full my-0"
                    src={article.author?.profileUrl}
                    alt=""
                  />
                ) : (
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-600">
                    <span className="text-lg font-medium uppercase text-white leading-none">
                      {article?.author?.username[0]}
                    </span>
                  </span>
                )}
                <a
                  rel="noopener noreferrer"
                  href={`/u/${article?.authorId}`}
                  className="hover:underline no-underline text-lg font-bold px-1 text-violet-400"
                >
                  {article?.author?.username}
                </a>
                • just now <br className="flex sm:hidden" /> • 4 min read •
                1,570 views
              </span>
              <div className="grow pb-1 hidden sm:flex gap-4 items-center px-4">
                {['plan', 'web development', 'free', 'team'].map((tag, idx) => (
                  <a
                    className="capitalize no-underline hover:underline hover:text-indigo-600 rounded-full text-sm text-gray-600"
                    key={idx}
                    href="#"
                  >
                    # {tag}
                  </a>
                ))}
              </div>
            </div>

            <button
              type="button"
              disabled={String(user?.userId) === article?.authorId}
              onClick={() => {
                if (!user) {
                  enqueueSnackbar(
                    'You must have an account to follow this user!',
                    {
                      action: notsigninToast,
                      variant: 'warning',
                    }
                  );
                } else if (String(user.userId) !== article?.authorId) {
                  xfollows({
                    fedId: String(user?.userId),
                    fingId: String(article?.authorId),
                  });
                }
              }}
              className={twmesh(
                'py-1.5 px-2.5 inline-flex justify-center items-center gap-x-1.5 rounded-md font-semibold bg-[#00a761] text-white outline-none text-base disabled:bg-gray-400 disabled:cursor-not-allowed',
                ifollowed?.includes(article?.authorId ?? '') && 'bg-gray-600'
              )}
            >
              {ifollowed?.includes(article?.authorId ?? '') ? (
                <>
                  <BsPersonCheck fontSize={25} /> Following
                </>
              ) : (
                <>
                  <BsPersonAdd fontSize={25} /> Follow
                </>
              )}
            </button>
          </div>

          {imageUrl && (
            <Image
              src={imageUrl}
              alt=""
              width={1000}
              height={300}
              className="object-fill object-center w-full my-8"
            />
          )}
          <div className="p-4">{renderedContent}</div>
        </article>
        {/* </ErrorBoundary> */}
      </EditorContainer>
    </ThemeProvider>
  );
}

// interface ErrorBoundaryState {
//   hasError: boolean;
//   error: Error | null;
//   errorInfo: ErrorInfo | null;
// }

export default Renderer;
