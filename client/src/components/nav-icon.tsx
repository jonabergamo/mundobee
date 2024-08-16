import Link from "next/link";
import React from "react";
import { RiSettings6Fill } from "react-icons/ri";
import { Label } from "./ui/label";

type NavIconProps = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  href?: string;
};

export default function NavIcon({
  icon,
  label,
  active = false,
  href = "#",
}: NavIconProps) {
  const style = active
    ? "flex w-full items-center justify-center md:justify-start gap-3 rounded  px-3 py-2 transition-all bg-primary text-primary-foreground"
    : "flex w-full items-center justify-center md:justify-start gap-3 rounded px-3 py-2 transition-all cursor-pointer";

  return (
    <Link className={style} href={href}>
      {icon}
      <span className="hidden md:block">{label}</span>
    </Link>
  );
}
