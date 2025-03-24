import { ReactNode } from "react";

const ContentPageWrapper = (props: { children: ReactNode }) => {
  return (
    <div className="h-full pt-6 pb-8 px-4 md:px-12 md:mr-20">
      <div className="border border-white p-[2px] rounded-lg h-full">
        <div className="border border-white rounded-lg p-6 md:p-12 mx-auto h-full overflow-y-auto">
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default ContentPageWrapper;
