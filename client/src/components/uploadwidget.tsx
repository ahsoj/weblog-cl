import { CldUploadWidget } from 'next-cloudinary';

export default function UploadWidget() {
  return (
    <CldUploadWidget uploadPreset="b_log-preset">
      {({ open }) => {
        function handleOnClick(ev: React.MouseEvent) {
          ev.preventDefault();
          open();
        }
        return (
          <button className="button" onClick={handleOnClick}>
            Upload an Image
          </button>
        );
      }}
    </CldUploadWidget>
  );
}
