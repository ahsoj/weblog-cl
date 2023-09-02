'use client';
import React, { useEffect, useState } from 'react';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { BsPlusLg } from 'react-icons/bs';
import { twmesh } from '@/utils/twmesh';
import {
  useGetUserProfileByIdQuery,
  useUpdateUserProfileMutation,
} from '@/utils/redux/ApiSlice';
import Form, { Field, FormInstance } from 'rc-field-form';
import Auth from '@/lib/sdk/Authentication';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import { Router } from 'next/router';
import { useRouter } from 'next/navigation';

const Input = ({ value = '', ...props }) => <input value={value} {...props} />;
const Textarea = ({ value = '', ...props }) => (
  <textarea value={value} {...props} />
);

const SubmitButton = ({ form }: { form: FormInstance }) => {
  const [submittable, setSubmittable] = React.useState(false);

  // Watch all values
  const values = Form.useWatch([], form);

  React.useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
        setSubmittable(true);
      },
      () => {
        setSubmittable(false);
      }
    );
  }, [form, values]);

  console.log(submittable);

  return (
    <button type="submit" disabled={!submittable}>
      Update
    </button>
  );
};

const Profile = ({ params }: { params: { id: string } }) => {
  const userID = params.id;
  const user = Auth.getUser();
  const router = useRouter();
  if (userID !== String(user?.userId)) router.push('/');
  const [addnewurl, setAddnewurl] = useState<boolean>(false);

  const { data: userProfile } = useGetUserProfileByIdQuery(
    (user?.userId as unknown as string) ?? skipToken
  );

  const [bioInputText, setBioInputText] = useState<string>(
    String(userProfile?.bio)
  );
  14;

  const [resyncProfile] = useUpdateUserProfileMutation();

  const [form] = Form.useForm();
  useEffect(() => {
    async () => {
      try {
        const values = await form.validateFields();
        console.log(values);
      } catch (errorList: any) {
        console.log(errorList);
        // errorList.forEach(({ name, errors }) => {
        //   // Do something...
        // });
      }
    };
  }, [form]);

  const toggleUrlAdder = () => {
    setAddnewurl(!addnewurl);
  };
  const handleBioInputChange = (ev: any) => {
    ev.preventDefault();
    setBioInputText(ev.target.value as unknown as string);
  };

  return (
    <div className="max-w-xl mx-auto py-8 justify-center items-center px-4">
      <Form
        name="validateOnly"
        onFinish={async (values) => {
          await resyncProfile({
            userId: String(userProfile?.id),
            username: values['username'],
            bio: values['profile_bio'],
          });
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="border-b border-gray-300 w-full py-1">
            <div className="flex items-center justify-between gap-2 wrap">
              <div>
                <h2 className="first-letter:uppercase font-bold text-xl">
                  {userProfile?.username}`s Profile
                </h2>
                <span>This is how others will see you on the site.</span>
              </div>
              <SubmitButton form={form} />
            </div>
          </div>
          <div className="flex w-full flex-col gap-2">
            <label
              htmlFor="input-label-with-helper-text"
              className="block text-lg font-semibold"
            >
              Username
            </label>
            <Field name="username">
              <input
                type="text"
                name="username"
                id="input-label-with-helper-text"
                className="py-3 px-4 block w-full border border-gray-200 rounded-md text-sm focus:ring-blue-400"
                placeholder="john doe"
                defaultValue={userProfile?.username}
                aria-describedby="hs-input-helper-text"
              />
            </Field>
            <span className="text-sm text-gray-500" id="hs-input-helper-text">
              This is your display name. it can be real name or a pseudonym. you
              can only change this once every 30 days.
            </span>
          </div>
          <div className="flex w-full flex-col gap-2">
            <label
              htmlFor="input-label-with-helper-text"
              className="block text-lg font-semibold"
            >
              Email
            </label>
            <input
              type="email"
              id="input-label-with-helper-text"
              className="opacity-70 pointer-events-none py-3 px-4 block w-full bg-gray-50 border-gray-200 rounded-md text-sm focus:ring-blue-400"
              placeholder="johndoe@gmail.com"
              defaultValue={userProfile?.email}
              aria-describedby="hs-input-helper-text"
              disabled
              readOnly
            />
            <span className="text-sm text-gray-500" id="hs-input-helper-text">
              your email cannot be changed once verified.
            </span>
          </div>
          <div className="flex w-full flex-col gap-2">
            <label
              htmlFor="input-label-with-helper-text"
              className="block text-lg font-semibold"
            >
              Bio
            </label>
            <Field name="profile_bio">
              <textarea
                rows={6}
                placeholder="add your bio ..."
                defaultValue={bioInputText}
                maxLength={150}
                onChange={handleBioInputChange}
                className={twmesh(
                  'py-2 px-4 border border-gray-200 rounded-md outline-none resize-none',
                  bioInputText.length > 150 && 'border-red-600 text-red-600'
                )}
              />
            </Field>
            <span
              className={twmesh(
                'text-end text-sm text-gray-500',
                bioInputText.length > 150 && 'border-red-600 text-red-600'
              )}
            >{`${bioInputText.length}/150`}</span>

            <span className="text-sm text-gray-500" id="hs-input-helper-text">
              you can `@mention` other users and organization to link to them
            </span>
          </div>
          <div className="flex w-full flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="block text-lg font-semibold">URLs</span>
              <button
                onClick={toggleUrlAdder}
                className="items-left w-[6rem] bg-black text-white py-1 rounded-md"
              >
                Add One
              </button>
            </div>
            <ADDURL
              addnew={addnewurl}
              closeUrl={toggleUrlAdder}
              username={String(userProfile?.username)}
            />
            {[
              'twitter.com/@joshjan',
              'facebook.com/joshua',
              'linkedin.com/joshua',
            ].map((email, idx) => (
              <div
                key={idx}
                className="group/socialurl flex py-1 px-2 w-full justify-between items-center border border-gray-200 rounded-md"
              >
                <span className="flex items-center px-3 pointer-events-none sm:text-sm rounded-l-md">
                  https://{email}
                </span>
                <button className="hidden group-hover/socialurl:flex text-orange-400 hover:text-orange-600">
                  <RiDeleteBin5Line fontSize={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Form>
    </div>
  );
};

export default Profile;

interface ADDURLProps {
  username: string;
  addnew: boolean;
  closeUrl: () => void;
}

const ADDURL: React.FC<ADDURLProps> = (props) => {
  const [url, setUrl] = useState('');
  const { username, closeUrl, addnew = false } = props;
  return (
    <div
      className={twmesh(
        'border border-slate-400 hidden rounded-md p-2 m-2 flex-col gap-2',
        addnew && 'flex'
      )}
    >
      <div className="peer-focus/addurl:border border-indigo-500 flex">
        <span className="flex items-center px-3 pointer-events-none sm:text-sm rounded-l-md ">
          https://
        </span>
        <input
          type="url"
          name="newurl"
          id="add-url"
          placeholder={`weblog.live/u/@${username}`}
          className="peer/addurl flex flex-1 outline-none sm:text-sm rounded-r-md"
        />
      </div>
      <div className="flex gap-2 justify-end grow px-2 items-center">
        <button
          onClick={closeUrl}
          className="rounded-md px-2 py-1 text-white bg-red-500"
        >
          close
        </button>
        <button className="rounded-md px-2 py-1 text-white bg-blue-500">
          add
        </button>
      </div>
    </div>
  );
};
