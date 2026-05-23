import Link from "next/link";
import { ChevronRightIcon as ChevronRight } from "@heroicons/react/24/outline";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-sm text-olive/60 uppercase tracking-widest mb-6 md:mb-8 z-10 relative flex-nowrap overflow-x-auto scrollbar-hide">
      <Link href="/" className="hover:text-olive  transition-colors">
        Home
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="w-3 h-3 md:w-4 md:h-4 opacity-50" />
          {item.href ? (
            <Link href={item.href} className="hover:text-olive  transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-olive  font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
