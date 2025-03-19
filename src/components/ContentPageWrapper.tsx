import { ReactNode } from "react";

const ContentPageWrapper = (props: { children: ReactNode }) => {
  return (
    <div className="pt-6 pb-32 px-4 md:px-12 md:mr-20">
      <div className="border border-white p-[2px] rounded-lg">
        <div className="border border-white rounded-lg p-6 md:p-12 mx-auto">
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default ContentPageWrapper;
