import React from 'react';
import Image from 'next/image';

type Notification = {
  id: string;
  content: string;
  timestamp: string;
  unread: boolean;
};

interface IEmpty {
  className?: string;
  notification: Notification[];
}

const DisplayNotification: React.FC<IEmpty> = (props) => {
  const { className, notification } = props;
  return (
    <div className={className}>
      {notification.length > 0 ? (
        notification.map((notify, idx) => (
          <div
            key={idx}
            className="block border overflow-hidden border-slate-200 gap-4 p-4"
          >
            <div className="flex gap-4 items-start">
              <Image
                width={48}
                height={48}
                className="rounded-full"
                src="/user_profile.png"
                alt="Image Description"
              />
              <div className="block items-start">
                <div className="flex items-center gap-4">
                  <p className="text-xl capitalize">Joshua</p>
                  <span className="opacity-50 text-sm">made a new post</span>
                </div>
                <span className="text-xs">on {notify.timestamp}</span>
              </div>
            </div>
            <h1 className="text-base pl-8">{notify.content}</h1>
          </div>
        ))
      ) : (
        <div className="text-center justify-center items-center flex flex-col opacity-50">
          <Image
            src="/icons/bell.svg"
            alt=""
            className="object-contain block"
            width={80}
            height={80}
          />
          <h3>No New Notifications</h3>
        </div>
      )}
    </div>
  );
};

export default DisplayNotification;
