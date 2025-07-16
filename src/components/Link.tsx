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
  const key = searchParams.get("key");

  let finalHref = href;
  const appendKeyParam = key ? `key=${encodeURIComponent(key)}` : "";

  if (typeof href === "string" && appendKeyParam) {
    const hasQuery = href.includes("?");
    finalHref = `${href}${hasQuery ? "&" : "?"}${appendKeyParam}`;
  } else if (typeof href === "object" && appendKeyParam) {
    finalHref = {
      ...href,
      search: href.search
        ? `${href.search}&${appendKeyParam}`
        : `?${appendKeyParam}`,
    };
  }

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
      }, 300);
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
