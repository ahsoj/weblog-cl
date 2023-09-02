import React from 'react';

export const ProfileLoader = () => {
  return (
    <div className="flex py-4 gap-4 px-2 items-center justify-between border-b border-gray-200">
      <div className="flex items-center gap-4">
        <div className="w-16 h-8 bg-gray-200 rounded-md" />
        <div className="w-48 hidden md:flex h-8 bg-gray-200 rounded-md" />
      </div>
      <div className="flex gap-4 items-center justify-center">
        <div className="w-8 h-8 bg-gray-200 rounded-md" />
        <div className="w-8 h-8 bg-gray-200 rounded-md" />
        <svg
          className="w-8 h-8 text-gray-200 mr-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
        </svg>
      </div>
    </div>
  );
};
