"use client";

import { useRouter } from "next/navigation";
import NextLink, { LinkProps } from "next/link";
import React from "react";

type Props = LinkProps & {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export default function Link({ href, children, onClick, ...rest }: Props) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (onClick) {
      e.preventDefault();
      onClick();
      setTimeout(() => {
        if (typeof href === "string") {
          router.push(href);
        } else if (typeof href === "object" && href.pathname) {
          router.push(href.pathname + (href.search || ""));
        }
      }, 300);
    }
  };

  return (
    <NextLink href={href} {...rest} onClick={handleClick}>
      {children}
    </NextLink>
  );
}
