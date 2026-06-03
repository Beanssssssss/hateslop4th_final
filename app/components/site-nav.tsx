import Link from "next/link";

const links = [
  { href: "/topics", label: "Topic" },
  { href: "/vote", label: "Vote" },
];

export function SiteNav() {
  return (
    <nav className="site-nav" aria-label="주요 메뉴">
      <Link className="brand" href="/">
        Hateslop Final
      </Link>
      <div className="nav-links">
        {links.map((link) => (
          <Link href={link.href} key={link.href}>
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
