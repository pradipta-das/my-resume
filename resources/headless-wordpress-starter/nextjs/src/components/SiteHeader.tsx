import Link from "next/link";
import { getMenu, localUrl } from "@/lib/wordpress";

// The site name and the menu assigned to the "Primary Menu" location in
// WordPress (Appearance › Menus).
export default async function SiteHeader({ name }: { name: string }) {
  const menu = await getMenu("primary");

  return (
    <header className="border-b border-zinc-200">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-5">
        <Link href="/" className="text-lg font-bold text-zinc-900">
          {name}
        </Link>
        {menu.length > 0 && (
          <nav aria-label="Main">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {menu.map((item) => (
                <li key={item.id}>
                  <Link
                    href={localUrl(item.url)}
                    target={item.target || undefined}
                    className="text-zinc-700 hover:text-zinc-900 hover:underline"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
