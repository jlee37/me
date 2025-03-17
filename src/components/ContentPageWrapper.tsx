import { ReactNode } from "react";

const ContentPageWrapper = (props: { children: ReactNode }) => {
  return (
    <div className="pt-6 pb-32 px-4 md:px-12 md:mr-20">
      <div className="border border-white rounded-lg p-6 md:p-12 mx-auto mb-16">
        {props.children}
      </div>
    </div>
  );
};

export default ContentPageWrapper;
