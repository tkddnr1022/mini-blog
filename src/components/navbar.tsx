import { NavbarClient } from "@/components/navbar-client";
import { siteConfig } from "@/lib/config";

export async function Navbar() {
  const { name, github, email } = siteConfig();

  const links = [
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
