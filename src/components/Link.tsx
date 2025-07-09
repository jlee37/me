"use client";

import { useSearchParams } from "next/navigation";
import NextLink, { LinkProps } from "next/link";
import React, { Suspense } from "react";

type Props = LinkProps & {
  children: React.ReactNode;
  className?: string;
};

function LinkWithParams({ href, children, ...rest }: Props) {
  const searchParams = useSearchParams();
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

  return (
    <NextLink href={finalHref} {...rest}>
      {children}
    </NextLink>
  );
}

export default function Link(props: Props) {
  return (
    <Suspense fallback={null}>
      <LinkWithParams {...props} />
    </Suspense>
  );
}
