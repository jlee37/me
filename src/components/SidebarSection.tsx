import Link from "./Link";

export type SidebarSectionProps = {
  title: string;
  basePath: string;
  onLinkClick?: () => void;
  currentPathName: string;
  isMobile?: boolean;
  showFullscreen?: boolean;
};

export const SidebarSection = ({
  title,
  basePath,
  onLinkClick,
  currentPathName,
  isMobile = false,
  showFullscreen = false,
}: SidebarSectionProps) => {
  return (
    <div
      className={`${!showFullscreen && isMobile ? "cursor-pointer" : "cursor-default"}`}
    >
      <Link
        href={`/${basePath}`}
        className={`underline md:hover:text-indigo-400 active:text-indigo-400 transition-colors duration-100 ${currentPathName === `/${basePath}` ? "text-indigo-400" : ""}`}
        onClick={onLinkClick}
      >
        {title}
      </Link>
    </div>
  );
};
