'use client';

import { useSearchParams } from 'next/navigation';

const Search = () => {
  const searchParams = useSearchParams().get('query');
  console.log(searchParams);
  return (
    <div className="min-h-[15rem] flex flex-col">
      <div className="flex flex-auto flex-col justify-center items-center p-4 md:p-5">
        <svg
          className="max-w-[5rem]"
          viewBox="0 0 375 428"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M254.509 253.872L226.509 226.872"
            className="stroke-gray-400"
            stroke="currentColor"
            strokeWidth="7"
            stroke-linecap="round"
          />
          <path
            d="M237.219 54.3721C254.387 76.4666 264.609 104.226 264.609 134.372C264.609 206.445 206.182 264.872 134.109 264.872C62.0355 264.872 3.60864 206.445 3.60864 134.372C3.60864 62.2989 62.0355 3.87207 134.109 3.87207C160.463 3.87207 184.993 11.6844 205.509 25.1196"
            className="stroke-gray-400"
            stroke="currentColor"
            strokeWidth="7"
            stroke-linecap="round"
          />
          <rect
            x="270.524"
            y="221.872"
            width="137.404"
            height="73.2425"
            rx="36.6212"
            transform="rotate(40.8596 270.524 221.872)"
            className="fill-gray-400 "
            fill="currentColor"
          />
          <ellipse
            cx="133.109"
            cy="404.372"
            rx="121.5"
            ry="23.5"
            className="fill-gray-400"
            fill="currentColor"
          />
          <path
            d="M111.608 188.872C120.959 177.043 141.18 171.616 156.608 188.872"
            className="stroke-gray-400"
            stroke="currentColor"
            strokeWidth="7"
            stroke-linecap="round"
          />
          <ellipse
            cx="96.6084"
            cy="116.872"
            rx="9"
            ry="12"
            className="fill-gray-400"
            fill="currentColor"
          />
          <ellipse
            cx="172.608"
            cy="117.872"
            rx="9"
            ry="12"
            className="fill-gray-400"
            fill="currentColor"
          />
          <path
            d="M194.339 147.588C189.547 148.866 189.114 142.999 189.728 138.038C189.918 136.501 191.738 135.958 192.749 137.131C196.12 141.047 199.165 146.301 194.339 147.588Z"
            className="fill-gray-400"
            fill="currentColor"
          />
        </svg>
        <p className="mt-5 text-sm text-gray-500">
          No article found for <b>`{searchParams}`</b>
        </p>
        <a
          href="/"
          className="py-3 px-4 mt-2 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:underline hover:text-indigo-500 hover:border-indigo-500 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm "
        >
          <svg
            className="w-2.5 h-auto rotate-180"
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M1 7C0.447715 7 -3.73832e-07 7.44771 -3.49691e-07 8C-3.2555e-07 8.55228 0.447715 9 1 9L13.0858 9L7.79289 14.2929C7.40237 14.6834 7.40237 15.3166 7.79289 15.7071C8.18342 16.0976 8.81658 16.0976 9.20711 15.7071L16.0303 8.88388C16.5185 8.39573 16.5185 7.60427 16.0303 7.11612L9.20711 0.292893C8.81658 -0.0976318 8.18342 -0.0976318 7.79289 0.292893C7.40237 0.683417 7.40237 1.31658 7.79289 1.70711L13.0858 7L1 7Z"
              fill="currentColor"
            />
          </svg>
          Return to home page
        </a>
      </div>
    </div>
  );
};

export default Search;
