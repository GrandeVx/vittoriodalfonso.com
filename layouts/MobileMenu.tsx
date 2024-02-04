"use client";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { usePathname } from "next/navigation";

export default function MobileMenu() {
  const pathname = usePathname();
  return (
    <Drawer>
      <DrawerTrigger>
        <section className="flex min-h-10 w-screen justify-between border-t border-border p-3 pl-5">
          <p className="text-sm text-gray-400">{pathname}</p>
          <div className="flex items-center justify-center gap-2">
            <p className="text-sm">Open Navigation</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </div>
        </section>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className=" w-full">
          <section className="flex min-h-10 w-screen justify-between border-t border-border p-3 pl-5">
            <p className="text-sm text-gray-400">{pathname}</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-sm">Open Navigation</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </div>
          </section>
        </DrawerHeader>
        <DrawerFooter>
          <button>Submit</button>
          <DrawerClose>
            <button>Cancel</button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
