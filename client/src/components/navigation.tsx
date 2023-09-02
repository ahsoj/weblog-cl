import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Form, { Field } from 'rc-field-form';
import PulseLoader from 'react-spinners/PulseLoader';
import { LuSearch, LuMenu } from 'react-icons/lu';
import { useRouter } from 'next/navigation';

const Navigation: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const router = useRouter();
  const [successLoading, setSuccessLoading] = useState<boolean>(false);
  const handleSearchQuery = (values: { _query: string }) => {
    // console.log(values._query);
    const queryValue = values._query.replaceAll(' ', '+');
    try {
      router.push(`/search?_query=${queryValue}`);
      setSuccessLoading(true);
      setTimeout(() => {
        setSuccessLoading(false);
      }, 3000);
    } catch (err) {
      setSuccessLoading(false);
      console.error(err);
    }
  };
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto px-4 py-2">
        <div className="flex gap-3 w-full items-center justify-between md:justify-normal">
          <Link href="/" className="flex rounded items-center">
            <Image alt="" src="/logo8_27_13417.png" width={100} height={70} />
            {/* <span className="self-center text-white py-0.5 px-1 font-oswald font-black text-2xl whitespace-nowrap">
              WEBLOG
            </span> */}
          </Link>
          <div className="w-full md:max-w-md sm:gap-x-3 sm:order-3">
            <div className="border w-full hidden md:block border-gray-300 mx-auto rounded-md ">
              <label htmlFor="icon" className="sr-only">
                Search
              </label>
              <Form onFinish={handleSearchQuery}>
                <div className="relative">
                  <Field name="_query">
                    <input
                      type="text"
                      id="icon"
                      name="_query"
                      className="py-2 font-oswald pl-3 pr-10 flex flex-grow w-full bg-transparent border-gray-700 shadow-sm rounded-md text-lg outline-none font-semibold text-gray-700 focus:z-10 placeholder:text-gray-400"
                      placeholder="Search ..."
                    />
                  </Field>
                  <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 px-2">
                    {successLoading ? (
                      <PulseLoader color="#36d7b7" />
                    ) : (
                      <LuSearch fontSize={25} />
                    )}
                  </div>
                </div>
              </Form>
            </div>
            <div className="cursor-pointer block md:hidden p-1 float-right rounded-md hover:bg-gray-200 w-[3em]">
              <LuSearch fontSize={25} />
            </div>
          </div>
        </div>
        <div className="flex flex-grow items-center justify-end gap-3">
          {children}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
