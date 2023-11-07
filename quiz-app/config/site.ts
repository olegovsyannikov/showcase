export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Smoke Quiz — Zeroinstitute.online",
  description: "Journey to real you starts here.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Smoke Quiz",
      href: "/smoke-quiz",
    },
  ],
  navMenuItems: [
    {
      label: "Smoke Quiz",
      href: "/smoke-quiz",
    },
    {
      label: "Privacy policy",
      href: "/privacy",
    },
    {
      label: "Terms of use",
      href: "/terms",
    },
    {
      label: "Payment terms",
      href: "/payment",
    },
    {
      label: "Money back policy",
      href: "/money-back",
    },
    {
      label: "FAQ",
      href: "/faq",
    },
    {
      label: "Contact us",
      href: "/contact-us",
    },
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui-docs-v2.vercel.app",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
