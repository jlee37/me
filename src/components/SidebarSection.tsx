import { Memory, PhotoEssay, Writing } from "../../types/contentful";
import Link from "./Link";

export type SidebarSectionProps = {
  title: string;
  realItems?: (Writing | Memory | PhotoEssay)[];
  basePath: string;
  onLinkClick?: () => void;
  currentPathName: string;
  isMobile?: boolean;
  showFullscreen?: boolean;
};

export const SidebarSection = ({
  title,
  realItems,
  basePath,
  onLinkClick,
  currentPathName,
  isMobile = false,
  showFullscreen = false,
}: SidebarSectionProps) => {
  const items =
    realItems?.map((writing: Writing | Memory | PhotoEssay) => ({
      title: writing.fields.title?.toLowerCase() ?? "",
      slug: writing.fields.slug,
      date: writing.fields.date,
    })) ?? [];

  const sortedItems = items
    ? [...items].sort(
        (a, b) =>
          new Date(b?.date ?? 0).getTime() - new Date(a?.date ?? 0).getTime()
      )
    : [];

  return (
    <div
      className={`${!showFullscreen && isMobile ? "cursor-pointer" : "cursor-default"}`}
    >
      <Link
        href={`/${basePath}`}
        className={`underline md:hover:text-indigo-400 active:text-indigo-400 transition-colors duration-100 ${currentPathName === `/${basePath}` ? "text-indigo-400" : ""}`}
      >
        {title}
      </Link>
      <div className={`ml-4 md:ml-6 ${isMobile ? "hidden" : ""}`}>
        {sortedItems?.map((item) => {
          const isActive = currentPathName === `/${basePath}/${item.slug}`;

          return (
            <div key={item.title}>
              <Link
                href={`/${basePath}/${item.slug}`}
                className={`md:hover:text-indigo-400 active:text-indigo-400 transition-colors duration-100 text-base ${isActive ? "text-indigo-400" : ""}`}
                onClick={onLinkClick}
              >
                {item.title}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
