'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormikProps, Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { BsGithub } from 'react-icons/bs';
import { FcGoogle } from 'react-icons/fc';
import { enqueueSnackbar } from 'notistack';
import Loading from '@/components/loading';
import Auth from '@/lib/sdk/Authentication';
import { twmesh } from '@/utils/twmesh';

const validationSchema = Yup.object({
  name: Yup.string()
    .min(4, 'Name should be of minimum 4 characters length')
    .required('name is required'),
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password should be of minimum 8 characters length'),
  confirmPassword: Yup.string()
    .label('confirm password')
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Both Passwords must be match.'),
});

interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const CreateAccount: React.FC<FormikProps<FormValues>> = (props) => {
  // const { touched, errors, isSubmitting, message } = props;
  // console.log(touched, errors, isSubmitting, message);
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const initialValues: FormValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  if (isLoading) {
    return <Loading />;
  }
  return (
    <main className="w-full max-w-md mx-auto p-6">
      <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm relative">
        <div
          className={twmesh(
            'absolute hidden inset-0 z-20 cursor-not-allowed justify-center items-center bg-white/[.5]',
            formSubmitting && 'flex'
          )}
        >
          <div
            className="inline-block h-12 w-12 animate-spin pointer-events-none rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          ></div>
        </div>
        <div className="p-4 sm:p-7">
          <div className="text-start">
            <h1 className="block text-2xl font-unbounded font-bold text-gray-800 ">
              Create New Account{' '}
              <code className="text-3xl text-red-500">.</code>
            </h1>
            <p className="mt-2 text-sm text-gray-600 ">
              Already have an account?
              <Link
                className="text-blue-600 ml-2 hover:underline decoration-2  font-medium"
                href="/signin"
              >
                Sign in here
              </Link>
            </p>
          </div>

          <div className="mt-5">
            <button
              type="button"
              className="w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm"
            >
              <BsGithub className="text-2xl" />
              Sign up with Github
            </button>
            <button
              type="button"
              className="w-full my-3 py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm"
            >
              <FcGoogle className="text-2xl" />
              Sign up with Google
            </button>
            <div className="py-3 flex items-center text-xs text-gray-400 uppercase font-antonio before:flex-[1_1_0%] before:border-t before:border-gray-200 before:mr-6 font-black after:flex-[1_1_0%] after:border-t after:border-gray-200 after:ml-6 ">
              Or
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={async (values, actions) => {
                try {
                  setIsLoading(false);
                  setFormSubmitting(true);
                  if (values['password'] !== values['confirmPassword']) {
                    enqueueSnackbar('Passwords must be match', {
                      variant: 'error',
                    });
                    return;
                  }
                  await Auth.register({
                    name: values['name'],
                    email: values['email'],
                    password: values['password'],
                  })
                    .then(() => {
                      enqueueSnackbar('Account created successfully', {
                        variant: 'success',
                      });
                      actions.setSubmitting(false);
                      actions.resetForm();
                    })
                    .catch((err: any) => {
                      enqueueSnackbar(err.response.data, { variant: 'error' });
                      setFormSubmitting(false);
                    });
                } catch (err: any) {
                  console.log(err.response);
                  enqueueSnackbar(
                    'Something went wrong, please try again later',
                    { variant: 'error' }
                  );
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <div className="grid gap-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="after:content-['*'] after:text-red-500 after:text-xl after:ml-1 block text-sm mb-2 "
                      >
                        Username
                      </label>
                      <div className="relative">
                        <Field
                          type="text"
                          id="name"
                          name="name"
                          placeholder="john"
                          className={twmesh(
                            'py-3 px-4 block w-full outline-none border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 ',
                            touched?.name &&
                              errors.name &&
                              'border-red-400 text-red-400'
                          )}
                          required
                          aria-describedby="name-error"
                        />
                      </div>
                      {touched?.name && errors.name && (
                        <div className="text-[12px] text-red-500">
                          {errors.name}
                        </div>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="after:content-['*'] after:text-red-500 after:text-xl after:ml-1 block text-sm mb-2 "
                      >
                        Email address
                      </label>
                      <div className="relative">
                        <Field
                          type="email"
                          id="email"
                          name="email"
                          placeholder="name@example.com"
                          className={twmesh(
                            'py-3 px-4 block w-full outline-none border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 ',
                            touched?.email &&
                              errors.email &&
                              'border-red-400 text-red-400'
                          )}
                          required
                          aria-describedby="email-error"
                        />
                      </div>
                      {touched?.email && errors.email && (
                        <div className="text-[12px] text-red-500">
                          {errors.email}
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="after:content-['*'] after:text-red-500 after:text-xl after:ml-1 block text-sm mb-2 "
                      >
                        Password
                      </label>
                      <div className="relative">
                        <Field
                          type="password"
                          id="password"
                          name="password"
                          placeholder="************"
                          className={twmesh(
                            'py-3 px-4 block w-full outline-none border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 ',
                            touched?.password &&
                              errors.password &&
                              'border-red-400 text-red-400'
                          )}
                          required
                          aria-describedby="password-error"
                        />
                      </div>
                      {touched?.password && errors.password && (
                        <div className="text-[12px] text-red-500">
                          {errors.password}
                        </div>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="after:content-['*'] after:text-red-500 after:text-xl after:ml-1 block text-sm mb-2 "
                      >
                        Password (Confirm)
                      </label>
                      <div className="relative">
                        <Field
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          placeholder="************"
                          className={twmesh(
                            'py-3 px-4 block w-full outline-none border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 ',
                            touched?.confirmPassword &&
                              errors.confirmPassword &&
                              'border-red-400 text-red-400'
                          )}
                          required
                          aria-describedby="confirm-password-error"
                        />
                      </div>
                      {touched?.confirmPassword && errors.confirmPassword && (
                        <div className="text-[12px] text-red-500">
                          {errors.confirmPassword}
                        </div>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm "
                    >
                      Sign up
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CreateAccount;
