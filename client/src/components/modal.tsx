'use client';

import { twmesh } from '@/utils/twmesh';

type ModalProps = {
  open: boolean;
  closeModal: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({
  open = false,
  closeModal,
  children,
}) => {
  return (
    <div
      className={twmesh(
        'hidden w-full h-full fixed top-0 left-0 z-[60] bg-black/[.15] overflow-hidden [--overlay-backdrop:static]',
        open && 'flex'
      )}
    >
      <div
        className={twmesh(
          ' mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto',
          open && 'mt-7 opacity-100 duration-500'
        )}
      >
        <div className="p-2 bg-white shadow-sm rounded-md">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
