'use client';
import ContentEditor from '@/components/editor';
import React, { useEffect, useRef, useState } from 'react';
import LoadingSVG from '@/components/loading';
import { BsCloudUpload } from 'react-icons/bs';
import { useAppDispatch, useTypedSelector } from '@/utils/redux/hooks';
import { setNewTitle } from '@/utils/redux/toolKitSlice';
import { RootState } from '@/utils/redux/store';
import { useAutoResizeTextArea } from '@/utils/customHooks';
import { useCreateArticleMutation } from '@/utils/redux/ApiSlice';
import axios from '@/lib/sdk/axios';
import Auth from '@/lib/sdk/Authentication';
import { useRouter } from 'next/navigation';
import CustomEditor from '@/components/content_editor/editor';

const CreateStory = () => {
  const [htmlContent, setHTML] = useState({});
  const [textAreaValue, setTextAreaValue] = useState<string>('');
  const [fullLoading, setFullLoading] = useState<boolean>(false);
  const [coverImage, setCoverImage] = useState<any>({
    file: null,
    imgURL: null,
  });
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const router = useRouter();

  const [createArticle, response] = useCreateArticleMutation();

  // useAutoResizeTextArea(
  //   textAreaRef as unknown as HTMLTextAreaElement,
  //   textAreaValue
  // );

  const dispatch = useAppDispatch();
  const created_article = useTypedSelector(
    (state: RootState) => state.sliceToolkit
  );

  useEffect(() => {
    // fetch data here and update state with response
    setFullLoading(true);
    return () => setFullLoading(false);
  }, []);
  if (!fullLoading) {
    return <LoadingSVG />;
  }

  const handleGetImage = (event: React.BaseSyntheticEvent) => {
    let reader = new FileReader();
    let file = event.target.files[0];
    reader.onloadend = () => {
      setCoverImage({ file: file, imgURL: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // const handleGetTitle = (event: React.BaseSyntheticEvent) => {
  //   const value: string = event.target.value;
  //   setTextAreaValue(value);
  //   dispatch(setNewTitle(value));
  // };

  const getArticleBody = async () => {
    try {
      const formData = new FormData();
      formData.set('article_asset', coverImage.file);
      const session = Auth.getUser();
      if (session) {
        let data = {
          ...created_article,
          authorId: session.userId as unknown as string,
          published: true,
          imageUrl: '',
        };
        if (coverImage.file) {
          await axios
            .post('/article/upload/', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            .then((res) => {
              data.imageUrl = res.data;
              createArticle(data);
            })
            .then(() => router.push('/'))
            .catch((err) => console.log(err));
        } else {
          createArticle(data);
        }
      }
    } catch (error) {
      console.log(error);
    }
    // const fileData = JSON.stringify(htmlContent);
    // const blob = new Blob([fileData], { type: 'text/plain' });
    // const url = URL.createObjectURL(blob);
    // const link = document.createElement('a');
    // link.download = 'user-info.json';
    // link.href = url;
    // link.click();
  };

  return (
    <div>
      <div
        className="container flex flex-col bg-white transition-all ease-in-out self-center mx-auto w-[90%] lg:w-2/3 xl:w-1/2
      min-h-screen relative rounded-md gap-6 mt-6 p-4"
      >
        {/* <div className="title h-fit">
          <textarea
            name="post-title"
            ref={textAreaRef}
            rows={1}
            value={textAreaValue}
            onChange={(ev) => handleGetTitle(ev)}
            id="with-corner-hint"
            autoFocus
            className="py-3 text-6xl overflow-y-hidden resize-none outline-none border-0 font-black block w-full"
            placeholder="My article title ..."
          />
        </div> */}
        {!coverImage.imgURL ? (
          <div className="flex items-center justify-center w-full mb-4">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <BsCloudUpload className="text-gray-500 text-4xl" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">
                  SVG, PNG, JPG or GIF (Recommended. 900x380px)
                </p>
              </div>
              <input
                onChange={(ev) => handleGetImage(ev)}
                id="dropzone-file"
                type="file"
                accept="image/*"
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div className="relative group">
            <img
              src={coverImage.imgURL || ''}
              className="block mb-4 w-full max-h-96 object- group-hover:blur-[1px]"
              alt=""
            />
            <div className="absolute hidden group-hover:flex justify-center inset-0">
              <button
                onClick={() => setCoverImage({ file: '', imgURL: '' })}
                className="px-4 self-center py-2 text-white border border-slate-300 rounded-md hover:text-red-200 hover:border-red-300 hover:bg-red-600/[.6] align-middle bg-slate-500/[.5]"
              >
                Remove
              </button>
            </div>
          </div>
        )}
        <CustomEditor />
      </div>
      <div className="border bg-white sticky bottom-0 flex gap-4 p-2 pr-8 flex-grow justify-end border-gray-300">
        <button
          // onClick={getArticleBody}
          className=""
        >
          Preview
        </button>
        <button
          onClick={getArticleBody}
          className="py-2 px-4 bg-blue-600 text-white rounded-sm"
        >
          Publish
        </button>
      </div>
    </div>
  );
};

export default CreateStory;
