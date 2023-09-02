import React, { useCallback } from 'react';

import { EditorContent, ReactNodeViewRenderer, useEditor } from '@tiptap/react';
import { useAddNewCommentMutation } from '@/utils/redux/ApiSlice';

import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import type { Comment } from '@/types/types';
import StarterKit from '@tiptap/starter-kit';
import { BsTypeBold, BsTypeItalic, BsReply, BsLink45Deg } from 'react-icons/bs';
import { AiOutlineLike } from 'react-icons/ai';
import { useAppDispatch, useTypedSelector } from '@/utils/redux/hooks';
import { RootState } from '@/utils/redux/store';
import { addnewComment } from '@/utils/redux/feedbackSlice';
import Auth from '@/lib/sdk/Authentication';
import ISOConvertor from '@/utils/iso_convertor';

interface Credential {
  postId?: string;
  userId?: string;
}

const CommentEditor = ({ cred }: { cred: Credential }) => {
  const dispatch = useAppDispatch();
  const current_user = Auth.getUser();

  const [addComment, response] = useAddNewCommentMutation();

  const editor = useEditor({
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      const comment: Object = {
        content: json,
        postId: cred.postId,
        userId: cred.userId,
      };
      dispatch(addnewComment(comment));
    },
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
      }),
      Placeholder.configure({
        placeholder: 'place your comment here ...',
      }),
    ],
    editorProps: {
      attributes: {
        class:
          'prose focus:outline-none prose-xl mx-auto prose-slate prose-a:text-blue-500 prose-a:hover:cursor-pointer',
      },
    },
  });
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

  const { content, postId, userId } = useTypedSelector(
    (state: RootState) => state.feedbackSlice
  );
  return (
    editor && (
      <div
        id="comment-view-section"
        className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50"
      >
        <div className="flex items-center justify-between p-2 border-b">
          <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x">
            <div className="flex items-center space-x-1 sm:pr-4">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`${
                  editor.isActive('bold') ? 'text-green-500' : ''
                } p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100`}
              >
                <BsTypeBold fontSize={20} />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`${
                  editor.isActive('italic') ? 'text-green-500' : ''
                } p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100`}
              >
                <BsTypeItalic fontSize={20} />
              </button>
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
            </div>
          </div>
          <button
            onClick={() => addComment({ content, postId, userId })}
            type="submit"
            className="inline-flex items-center px-5 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800"
          >
            Publish
          </button>
          <div
            id="tooltip-fullscreen"
            role="tooltip"
            className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip"
          >
            Show full screen
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
        </div>
        <div className="p-2 bg-white rounded-b-lg">
          <label htmlFor="editor" className="sr-only">
            comment your feedback
          </label>
          <EditorContent editor={editor} />
        </div>
      </div>
    )
  );
};

export const CommentPreview = ({ comment }: { comment?: Partial<Comment> }) => {
  // console.log(comment);
  const editor = useEditor({
    editable: false,
    content: comment?.content ?? '',
    extensions: [StarterKit, Link],
    editorProps: {
      attributes: {
        class:
          'prose focus:outline-none prose-xl mx-auto prose-slate prose-a:text-blue-500 prose-a:hover:cursor-pointer',
      },
    },
  });

  const Avatar = ({ ...props }) => {
    const { className } = props;
    return (
      <div className={className}>
        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-600">
          <span className="text-base font-medium uppercase text-white leading-none">
            A
          </span>
        </span>
      </div>
    );
  };

  return (
    <div className="my-6">
      {/* <!-- Comments --> */}
      <div className="flex items-start gap-2">
        <Avatar className="hidden sm:flex" />
        <div className="">
          <div className="flex flex-col gap-4 px-4 py-2 bg-white rounded border border-slate-100">
            <div className="flex items-center gap-2">
              <Avatar className="flex sm:hidden" />
              <span className="flex items-center gap-2">
                Joshua jan{' '}
                <span className="bg-gray-500 rounded-full w-1.5 aspect-square" />{' '}
                {comment &&
                  ISOConvertor(comment.createdAt as unknown as string)}
              </span>
            </div>
            <div className="pl-2 sm:pl-8">
              <EditorContent editor={editor} />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="hs-tooltip-toggle py-2 px-3 inline-flex justify-center items-center gap-x-1.5 sm:gap-x-2 rounded-md font-medium bg-white text-gray-700 align-middle hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-300 transition-all text-sm ">
              <AiOutlineLike fontSize={20} />
              <code>{comment?._count?.commentLike ?? '--'}</code> Likes
            </button>
            <button className="hs-tooltip-toggle py-2 px-3 inline-flex justify-center items-center gap-x-1.5 sm:gap-x-2 rounded-md font-medium bg-white text-gray-700 align-middle hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-300 transition-all text-sm ">
              <BsReply fontSize={20} />
              Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentEditor;
