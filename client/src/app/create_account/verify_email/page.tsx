import Image from 'next/image';

const VerifyPage = () => {
  return (
    <div className="max-w-xl mx-auto items-center justify-center h-full min-h-screen">
      <div className="max-w-sm p-6 text-center justify-center flex flex-col bg-white border border-slate-200 rounded-lg">
        <Image
          src="/verify_email.svg"
          className="block self-center"
          width={100}
          height={100}
          alt=""
        />
        <a href="#">
          <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
            Verify Your Email!
          </h5>
        </a>
        <p className="mb-3 font-normal text-gray-500">
          To activate your account you need to verify your email first, go to
          your email and verify now.
        </p>
        <a
          href="https://mail.google.com/mail"
          target="_blank"
          className="inline-flex items-center text-blue-600 hover:underline"
        >
          Open email
          <svg
            className="w-3 h-3 ml-2.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 18"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke-width="2"
              d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default VerifyPage;
