import { Separator } from "@/components/ui/separator"
export default function DesktopMenu() {
  return (
    <nav className="flex size-full flex-col gap-2 items-center justify-start pt-6 font-light text-sm text-gray-400 ">
      
      <div className="flex justify-between w-full gap-24 pl-4 pr-4">
        <p className="">Work</p>
        <p>4 projects</p>
      </div>
      <div className="flex justify-between w-full gap-24  pl-4 pr-4">
        <p>Ventures</p>
        <p>3 ideas</p>
      </div>
      <div className="flex justify-between w-full gap-24  pl-4 pr-4">
        <p>Timeline</p>
        <p>23 entries</p>
      </div>
      <div className="flex justify-between w-full gap-24  pl-4 pr-4">
        <p>About</p>
        <p>20 years</p>
      </div>
      <div className="flex justify-between w-full gap-24  pl-4 pr-4">
        <p>Resources</p>
        <p>9 entries</p>
      </div>
      
      <div className="w-full pl-4 pr-4 mt-4 mb-4">
      <Separator />
      </div>

      <div className="flex justify-between w-full gap-24  pl-4 pr-4">
        <p>Colophon</p>
        <p>5 topics</p>
      </div>

      <div className="flex justify-between w-full gap-24  pl-4 pr-4">
        <p>Imprint</p>

      </div>

    </nav>
  );
}
