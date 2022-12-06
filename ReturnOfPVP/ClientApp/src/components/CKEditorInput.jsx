import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build/build/ckeditor";

const editorConfig = {
  simpleUpload: {
    uploadUrl: `${process.env.REACT_APP_BASE_API_URL}pagecontent/image`,
    withCredentials: true,
  },
};

export default function CKEditorInput({
  value,
  name,
  onChange,
  invalid,
  style,
}) {
  return (
    <div
      className={`form-control p-0 ${
        invalid ? "is-invalid focus-parent-invalid" : "focus-parent"
      }`}
      id="textarea"
      style={{ ...style, minHeight: 64 }}
    >
      <CKEditor
        id={name}
        name={name}
        editor={Editor}
        config={editorConfig}
        data={value}
        onChange={onChange}
      />
    </div>
  );
}
