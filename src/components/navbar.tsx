import { NavbarClient } from "@/components/navbar-client";
import { getCategoryPath } from "@/lib/category";
import { siteConfig } from "@/lib/config";
import { getAllCategories } from "@/lib/posts";

export async function Navbar() {
  const { name, github, email } = siteConfig();
  const categories = await getAllCategories();
  const categoryHref =
    categories.length > 0 ? getCategoryPath(categories[0]) : "/";

  const links = [
    { href: "/", label: "목록" },
    { href: categoryHref, label: "카테고리" },
    { href: "/search", label: "검색" },
    { href: "/about", label: "About" },
  ];

  return (
    <NavbarClient
      name={name}
      github={github}
      email={email}
      links={links}
    />
  );
}
