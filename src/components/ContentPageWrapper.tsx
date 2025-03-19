import { ReactNode } from "react";

const ContentPageWrapper = (props: { children: ReactNode }) => {
  return (
    <div className="py-6 px-4 md:px-12 h-full">
      <div className="border border-white rounded-lg p-6 md:p-12 mx-auto mb-16 overflow-y-auto h-full">
        {props.children}
      </div>
    </div>
  );
};

export default ContentPageWrapper;
