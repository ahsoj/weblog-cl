import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import Link from 'next/link';
import { ISidebarProps } from '@/types/interface';

interface ISidebarProp extends ISidebarProps {
  children?: React.ReactNode;
}

const Sidebar: React.FC<ISidebarProp> = (props) => {
  const { isOpen, onSidebarClose, children } = props;
  return (
    <div
      style={{ display: isOpen ? 'block' : 'none' }}
      className="fixed top-0 transition-all ease-in-out inset-0 z-20 sm:hidden bg-black/[.2]"
    >
      <div className="bg-white h-screen border-e w-96 p-2">
        <div className="flex items-start justify-between">
          <Link
            href="/"
            className="text-white bg-black py-0.5 px-1 whitespace-nowrap font-unbounded font-black text-3xl"
          >
            B.LOG
          </Link>
          <AiOutlineClose
            onClick={onSidebarClose}
            fontSize={25}
            className="border cursor-pointer border-gray-400"
          />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
