import Link from "next/link";
import { i18n } from "@/i18n-config";
import { getDictionary } from "./dictionaries";

export default async function NotFound() {
  const dict = await getDictionary(i18n.defaultLocale);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <p className="text-sm font-mono uppercase tracking-widest text-primary/40">
        404
      </p>
      <h1 className="text-3xl font-bold tracking-tight">
        {dict.ui.notFoundTitle}
      </h1>
      <p className="max-w-md text-base text-primary/70">
        {dict.ui.notFoundDescription}
      </p>
      <Link
        href={`/${i18n.defaultLocale}`}
        className="rounded-full bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
      >
        {dict.ui.notFoundLink}
      </Link>
    </div>
  );
}
