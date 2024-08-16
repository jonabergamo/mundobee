import React from "react";
import Link from "next/link";
import { BellIcon, CheckIcon, Package2Icon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { GiBeehive, GiBee } from "react-icons/gi";
import { RiSettings6Fill, RiDashboardFill } from "react-icons/ri";
import { usePathname } from "next/navigation";
import NavIcon from "./nav-icon";

export default function Aside() {
  const pathname = usePathname();

  return (
    <div className="flex h-full max-h-screen flex-col">
      <div className="flex h-[65px] gap-2 items-center justify-center border-b md:px-5">
        <Link
          className="flex items-center justify-center md:gap-1 font-semibold"
          href="#"
        >
          <GiBee className="text-2xl" />
          <span className="hidden md:block">Mundobee</span>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-8 w-8" size="icon" variant="outline">
              <BellIcon className="h-4 w-4" />
              <span className="sr-only">Ver notificações</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div className="flex items-center gap-2">
                <TriangleAlertIcon className="h-4 w-4 text-red-500" />
                <div>
                  <div className="font-medium">Device Offline</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Device `Smart Thermostat` is offline.
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex items-center gap-2">
                <ZapIcon className="h-4 w-4 text-yellow-500" />
                <div>
                  <div className="font-medium">High Temperature</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Device `Greenhouse Sensor` has high temperature.
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-500" />
                <div>
                  <div className="font-medium">Device Online</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Device `Smart Plug` is now online.
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className=" overflow-auto py-2">
        <nav className="flex flex-col w-full items-center md:items-start px-4 text-sm font-medium">
          <NavIcon
            label="Dashboard"
            icon={<RiDashboardFill className="text-2xl md:text-lg" />}
            active={pathname == "/"}
            href="/"
          />
          <NavIcon
            label="Colmeias"
            icon={<GiBeehive className="text-2xl md:text-lg" />}
            active={pathname == "/hives"}
            href="/hives"
          />
          <NavIcon
            label="Predefinições"
            icon={<RiSettings6Fill className="text-2xl md:text-lg" />}
            active={pathname == "/presets"}
            href="/presets"
          />
        </nav>
      </div>
    </div>
  );
}

function TriangleAlertIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function ZapIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  );
}
