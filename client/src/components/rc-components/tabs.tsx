import { RcTabsProps } from '@/types/interface';
import { twmesh } from '@/utils/twmesh';

export const RcTabs: React.FC<RcTabsProps> = (props) => {
  const { items, activeKey, handleActiveTabKey } = props;
  return (
    <div className="">
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px">
          {items.map((item, idx) => (
            <li
              key={idx}
              onClick={() => handleActiveTabKey(item.key)}
              className="mr-2"
            >
              <span
                className={twmesh(
                  'inline-block p-4 border-indigo-600 hover:text-indigo-500 font-bold text-lg hover:border-b-2',
                  item.key === activeKey && 'border-b-2 text-indigo-600'
                )}
              >
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="my-6">
        {items.find((item) => item.key === activeKey)?.children}
      </div>
    </div>
  );
};
