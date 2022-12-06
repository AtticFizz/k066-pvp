import { Spinner } from "reactstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build/build/ckeditor";

export default function EditorBox({
  isContentLoading,
  editing,
  pageContent,
  setPageContent,
}) {
  console.log(editing);
  if (isContentLoading)
    return (
      <div className="w-100 h-100 d-flex align-items-center justify-content-center">
        <Spinner />
      </div>
    );
  return (
    <CKEditor
      editor={Editor}
      config={{
        simpleUpload: {
          uploadUrl: `${process.env.REACT_APP_BASE_API_URL}pagecontent/image`,
          withCredentials: true,
        },
      }}
      disabled={!editing}
      data={pageContent}
      onChange={(_, editor) => {
        setPageContent(editor.getData());
      }}
    />
  );
}
