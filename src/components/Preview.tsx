import Image from "next/image";
import Link from "./Link";

type PreviewBoxProps = {
  imageUrl: string;
  title: string;
  directToUrl: string;
};

function PreviewBox(props: PreviewBoxProps) {
  return (
    <Link href={props.directToUrl} className="w-full">
      <div className="group border border-gray-200 rounded-lg p-2 flex flex-col items-center cursor-pointer hover:shadow-lg transition-shadow duration-200 w-full md:hover:border-indigo-400">
        <Image
          src={props.imageUrl}
          alt={""}
          width={300}
          height={200}
          className="object-cover rounded-md mb-2 w-full h-40"
        />
        <div className="text-center font-semibold md:mt-2 md:mb-2 transition-colors md:group-hover:text-indigo-400 truncate w-full pl-2 pr-2">
          {props.title}
        </div>
      </div>
    </Link>
  );
}

type PreviewProps = {
  title: string;
  items: {
    imageUrl: string;
    title: string;
    directToUrl: string;
  }[];
};
export const Preview = (props: PreviewProps) => {
  return (
    <div className="relative pl-4 pr-4 w-full md:mt-12 md:pr-8">
      <h1 className="text-2xl pt-2 mb-0 bg-black">{props.title}</h1>

      <div className="grid md:grid-cols-4 grid-cols-1 overflow-auto gap-6 mt-4 pb-[200px] md:gap-3">
        {props.items.map((item, i) => (
          <PreviewBox
            imageUrl={item.imageUrl}
            title={item.title}
            directToUrl={item.directToUrl}
            key={i}
          />
        ))}
      </div>
    </div>
  );
};
