"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Mail, Menu, Search, X } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavLink = {
  href: string;
  label: string;
};

type NavbarClientProps = {
  name: string;
  github: string;
  email: string;
  links: NavLink[];
};

const SCROLL_THRESHOLD = 16;

export function NavbarClient({
  name,
  github,
  email,
  links,
}: NavbarClientProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      setReduceMotion(mediaQuery.matches);
    };

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => {
      mediaQuery.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    document.body.style.overflow = "hidden";

    const firstFocusable = panelRef.current?.querySelector<HTMLElement>(
      "a, button",
    );
    firstFocusable?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  const closeMobileNav = () => {
    setMobileOpen(false);
  };

  const transitionClass = reduceMotion ? "" : "transition-all duration-200";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border",
        transitionClass,
        scrolled
          ? "bg-background/80 shadow-sm backdrop-blur-md"
          : "bg-background/95 backdrop-blur-sm",
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-4.5xl items-center justify-between gap-4 px-6",
          transitionClass,
          scrolled ? "h-12" : "h-14",
        )}
      >
        <div className="flex min-w-0 items-center gap-4 sm:gap-6">
          <Link
            href="/"
            className="truncate text-sm font-semibold tracking-tight transition-opacity hover:opacity-70"
          >
            {name}
          </Link>
          <nav
            className="hidden items-center gap-4 sm:flex"
            aria-label="주 메뉴"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <Button
            ref={menuButtonRef}
            variant="ghost"
            size="icon"
            className="min-h-11 min-w-11 sm:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            {mobileOpen ? (
              <X className="size-4" aria-hidden />
            ) : (
              <Menu className="size-4" aria-hidden />
            )}
          </Button>
          <Button variant="ghost" size="icon" className="min-h-11 min-w-11" asChild>
            <Link href="/search" aria-label="검색">
              <Search className="size-4" aria-hidden />
            </Link>
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="min-h-11 min-w-11" asChild>
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              title="GitHub"
            >
              <img
                src="/github.svg"
                alt=""
                width={16}
                height={16}
                className="size-4 dark:invert"
                aria-hidden
              />
            </a>
          </Button>
          <Button variant="ghost" size="icon" className="min-h-11 min-w-11" asChild>
            <a href={`mailto:${email}`} aria-label="이메일" title="이메일">
              <Mail className="size-4" aria-hidden />
            </a>
          </Button>
        </div>
      </div>

      {mobileOpen ? (
        <div
          ref={panelRef}
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="모바일 메뉴"
          className="border-t border-border bg-background sm:hidden"
        >
          <nav aria-label="모바일 주 메뉴" className="mx-auto max-w-4.5xl px-6 py-4">
            <ul className="flex flex-col">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMobileNav}
                    className="flex min-h-11 items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
