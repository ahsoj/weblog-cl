'use client';
import { useAppDispatch } from '@/utils/redux/hooks';
import { setArticleContent } from '@/utils/redux/toolKitSlice';
import Dante, { MenuBarConfig } from 'dante3/package/esm';

const ContentEditor = ({ ...props }) => {
  const { setJSON } = props;
  const dispatch = useAppDispatch();
  return (
    <div>
      <Dante
        bodyPlaceholder={'My article body ...'}
        readOnly={false}
        tooltips={[
          MenuBarConfig({
            fixed: true,
            placement: 'up',
          }),
        ]}
        onUpdate={(editor: any) =>
          dispatch(setArticleContent(editor.getJSON()))
        }
      />
    </div>
  );
};

export default ContentEditor;
