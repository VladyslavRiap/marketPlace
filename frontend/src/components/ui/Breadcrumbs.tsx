import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <nav className="flex items-center text-sm text-gray-600">
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />}
          <Link
            href={item.href}
            className={`hover:text-blue-600 transition ${
              index === items.length - 1 ? "text-gray-500" : "text-blue-600"
            }`}
          >
            {item.name}
          </Link>
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
