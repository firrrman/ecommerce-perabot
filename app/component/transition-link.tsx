"use client";

import Link, { LinkProps } from "next/link";
import React from "react";

interface TransitionLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  href: string;
}

export default function TransitionLink({ children, href, className, ...props }: TransitionLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      {...props}
      onClick={(e) => {
        if (props.onClick) {
          props.onClick(e);
        }
        if (!e.defaultPrevented) {
          window.dispatchEvent(new CustomEvent("start-navigation", { detail: href }));
        }
      }}
    >
      {children}
    </Link>
  );
}
