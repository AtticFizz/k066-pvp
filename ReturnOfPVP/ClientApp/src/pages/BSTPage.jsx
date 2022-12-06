import { useRef, useState, useEffect } from "react";
import useSize from "@react-hook/size";

import BSTViz from "../components/TreeViz/BSTViz";
import Sidebar from "../components/Sidebar";
import PageContentService from "../services/PageContentService";
import EditorBox from "../components/EditorBox";

export default function BSTPage() {
  const PAGE_NAME = "BST";
  const containerRef = useRef(null);
  const [width, height] = useSize(containerRef);
  const [editing, setEditing] = useState(false);
  const [pageContent, setPageContent] = useState("");
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [isContentPosting, setIsContentPosting] = useState(false);

  useEffect(() => {
    PageContentService.get(PAGE_NAME)
      .then((r) => {
        r.data && setPageContent(r.data.content);
        setIsContentLoading(false);
      })
      .catch((e) => console.log(e.response));
  }, []);

  const handleEdit = () => {
    setIsContentPosting(true);
    PageContentService.update(pageContent, PAGE_NAME).then(() =>
      setIsContentPosting(false)
    );
  };

  return (
    <>
      <div ref={containerRef} className="bg-light flex-fill">
        <BSTViz width={width} height={height} />
      </div>
      <Sidebar
        editing={editing}
        setEditing={setEditing}
        title="TEORIJA"
        onEdit={handleEdit}
        loading={isContentPosting}
      >
        <EditorBox
          isContentLoading={isContentLoading}
          editing={editing}
          pageContent={pageContent}
          setPageContent={setPageContent}
        />
      </Sidebar>
    </>
  );
}
