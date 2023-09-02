import React from 'react';

const SetNewpassword = () => {
  return (
    <div className="flex h-full w-full max-w-md mx-auto items-center py-16">
      <div className="mt-7 bg-white border w-full border-gray-200 rounded-xl shadow-sm ">
        <div className="p-4">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800">
              Set new password
            </h1>
          </div>
          <form className="space-y-6">
            <div className="grid gap-y-4">
              <label
                htmlFor="password"
                className="after:content-['*'] after:text-red-500 after:text-xl after:ml-1 block text-sm mb-2 "
              >
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="********"
                  className="py-3 px-4 block w-full border outline-none border-gray-200 rounded-md text-sm"
                  required
                  aria-describedby="password-error"
                />
              </div>
              <p
                className="hidden text-xs text-red-600 mt-2"
                id="password-error"
              >
                8+ characters required
              </p>
            </div>

            <div className="w-full">
              <label
                htmlFor="confirm-password"
                className="after:content-['*'] after:text-red-500 after:text-xl after:ml-1 block text-sm mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="confirm-password"
                  name="confirm-password"
                  placeholder="********"
                  className="py-3 px-4 block w-full border outline-none border-gray-200 rounded-md text-sm"
                  required
                  aria-describedby="confirm-password-error"
                />
              </div>
              <p
                className="hidden text-xs text-red-600 mt-2"
                id="confirm-password-error"
              >
                Password does not match the password
              </p>
            </div>
            <button
              type="submit"
              className="py-3 px-4 w-full mt-2 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm "
            >
              Reset password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetNewpassword;
