import Link from "next/link";

export default function TopBar() {
  return (
    <Link href={"/"} className="fixed w-full  md:w-[70%] xl:w-[30%]">
      <section className="flex size-full items-center pt-5 lg:pl-4 xl:items-start xl:pl-7">
        <p className="w-3/6 text-sm md:w-2/6 lg:w-3/12 xl:w-5/12 xl:gap-4">
          Vittorio D&apos;Alfonso
        </p>
        <p className="text-sm font-light text-gray-400">Creative Developer</p>
      </section>
    </Link>
  );
}
