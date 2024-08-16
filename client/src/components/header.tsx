import React from "react";
import UserProfile from "./user-profile";

type HeaderProps = {
  title?: string;
};

export default function Header({ title }: HeaderProps) {
  return (
    <div className="flex h-14 md:h-auto items-center justify-between">
      <h2 className="font-semibold text-lg md:text-2xl">{title}</h2>
      <UserProfile />
    </div>
  );
}
