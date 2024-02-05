import { Separator } from "@/components/ui/separator";
import Link from "next/link";
export default function DesktopMenu() {
  return (
    <nav className="flex size-full flex-col items-center justify-start gap-2 pt-6 text-sm font-light text-gray-400 ">
      <Link
        href={"/work"}
        className="flex w-full cursor-pointer justify-between gap-24 pl-4 pr-4 hover:text-black dark:hover:text-white"
      >
        <p className="">Work</p>
        <p>4 projects</p>
      </Link>
      <Link
        href={"/ventures"}
        className="flex w-full cursor-pointer justify-between  gap-24 pl-4 pr-4 hover:text-black  dark:hover:text-white"
      >
        <p>Ventures</p>
        <p>3 ideas</p>
      </Link>
      <Link
        href={"/timeline"}
        className="flex w-full cursor-pointer justify-between  gap-24 pl-4 pr-4 hover:text-black  dark:hover:text-white"
      >
        <p>Timeline</p>
        <p>23 entries</p>
      </Link>
      <Link
        href={"/about"}
        className="flex w-full cursor-pointer justify-between  gap-24 pl-4 pr-4 hover:text-black  dark:hover:text-white"
      >
        <p>About</p>
        <p>20 years</p>
      </Link>
      <Link
        href={"/resources"}
        className="flex w-full cursor-pointer justify-between  gap-24 pl-4 pr-4 hover:text-black  dark:hover:text-white"
      >
        <p>Resources</p>
        <p>9 entries</p>
      </Link>

      <div className="mb-4 mt-4 w-full pl-4 pr-4">
        <Separator />
      </div>

      <Link
        href={"/colophon"}
        className="flex w-full cursor-pointer justify-between  gap-24 pl-4 pr-4 hover:text-black  dark:hover:text-white"
      >
        <p>Colophon</p>
        <p>5 topics</p>
      </Link>

      <Link
        href={"/imprint"}
        className="flex w-full cursor-pointer justify-between  gap-24 pl-4 pr-4 hover:text-black  dark:hover:text-white"
      >
        <p>Imprint</p>
      </Link>
    </nav>
  );
}
