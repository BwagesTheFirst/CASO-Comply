import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up — CASO Comply",
  robots: "noindex, nofollow",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
