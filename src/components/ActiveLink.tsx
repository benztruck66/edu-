"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function ActiveLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname.startsWith(href));
  return (
    <Link
      href={href}
      className={`hover:underline ${active ? "underline underline-offset-4" : ""}`}
    >
      {children}
    </Link>
  );
}


