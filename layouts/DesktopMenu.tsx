import { Separator } from "@/components/ui/separator"
import Link from "next/link";
export default function DesktopMenu() {
  return (
    <nav className="flex size-full flex-col gap-2 items-center justify-start pt-6 font-light text-sm text-gray-400 ">

      <Link href={"/work"} className="flex justify-between w-full gap-24 pl-4 pr-4 hover:text-black cursor-pointer">
        <p className="">Work</p>
        <p>4 projects</p>
      </Link>
      <Link href={"/ventures"} className="flex justify-between w-full gap-24  pl-4 pr-4 hover:text-black cursor-pointer">
        <p>Ventures</p>
        <p>3 ideas</p>
      </Link>
      <Link href={"/timeline"} className="flex justify-between w-full gap-24  pl-4 pr-4 hover:text-black cursor-pointer">
        <p>Timeline</p>
        <p>23 entries</p>
      </Link>
      <Link href={"/about"} className="flex justify-between w-full gap-24  pl-4 pr-4 hover:text-black cursor-pointer">
        <p>About</p>
        <p>20 years</p>
      </Link>
      <Link href={"/resources"} className="flex justify-between w-full gap-24  pl-4 pr-4 hover:text-black cursor-pointer">
        <p>Resources</p>
        <p>9 entries</p>
      </Link>
      
      <div className="w-full pl-4 pr-4 mt-4 mb-4">
      <Separator />
      </div>

      <Link href={"/colophon"} className="flex justify-between w-full gap-24  pl-4 pr-4 hover:text-black cursor-pointer">
        <p>Colophon</p>
        <p>5 topics</p>
      </Link>

      <Link href={"/imprint"} className="flex justify-between w-full gap-24  pl-4 pr-4 hover:text-black cursor-pointer">
        <p>Imprint</p>
      </Link>

    </nav>
  );
}
