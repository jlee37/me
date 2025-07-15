"use client";

import { useSearchParams, useRouter } from "next/navigation";
import NextLink, { LinkProps } from "next/link";
import React, { Suspense } from "react";

type Props = LinkProps & {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

function LinkWithParams({ href, children, onClick, ...rest }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = searchParams.toString();

  let finalHref = href;
  if (typeof href === "string" && params) {
    finalHref = href.includes("?") ? `${href}&${params}` : `${href}?${params}`;
  } else if (typeof href === "object" && params) {
    finalHref = {
      ...href,
      search: href.search ? `${href.search}&${params}` : `?${params}`,
    };
  }

  // Custom onClick logic for dialog transitions
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (onClick) {
      e.preventDefault();
      onClick();
      setTimeout(() => {
        if (typeof finalHref === "string") {
          router.push(finalHref);
        } else if (typeof finalHref === "object" && finalHref.pathname) {
          router.push(finalHref.pathname + (finalHref.search || ""));
        }
      }, 300); // Adjust delay to match your transition
    }
  };

  return (
    <NextLink href={finalHref} {...rest} onClick={handleClick}>
      {children}
    </NextLink>
  );
}

export default function Link(props: Props) {
  return (
    <Suspense>
      <LinkWithParams {...props} />
    </Suspense>
  );
}
