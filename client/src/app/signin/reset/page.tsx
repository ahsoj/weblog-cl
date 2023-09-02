'use client';

import { Field, Form, Formik } from 'formik';
import { enqueueSnackbar } from 'notistack';
import * as Yup from 'yup';
import Auth from '@/lib/sdk/Authentication';
import { useState } from 'react';
import { twmesh } from '@/utils/twmesh';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
});

interface FormValues {
  email: string;
}

const ResetPassword = () => {
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const initialValues: FormValues = { email: '' };
  return (
    <div className="flex h-full w-full max-w-md mx-auto items-center py-16">
      <div className="mt-7 bg-white border w-full border-gray-200 rounded-xl shadow-sm relative">
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
        <div className="p-4">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800">
              Forgot password?
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Remember your password?
              <a
                className="text-blue-600 decoration-2 hover:underline font-medium"
                href="/signin"
              >
                Sign in here
              </a>
            </p>
          </div>

          <div className="mt-5">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={async (values, actions) => {
                try {
                  setFormSubmitting(true);
                  await Auth.resetPassword(values['email'])
                    .then(() => {
                      enqueueSnackbar(
                        'We send a link to your email. please check it to reset your password',
                        {
                          variant: 'success',
                        }
                      );
                      actions.setSubmitting(false);
                      setTimeout(() => {
                        setFormSubmitting(false);
                      }, 3000);
                      actions.resetForm();
                    })
                    .catch((err: any) => {
                      enqueueSnackbar(err.response.data, {
                        variant: 'error',
                      });
                      setFormSubmitting(false);
                    });
                  actions.setSubmitting(false);
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <div className="grid gap-y-4">
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

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm "
                    >
                      Reset Password
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
