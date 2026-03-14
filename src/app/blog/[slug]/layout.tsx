import MarketingLayout from "@/components/MarketingLayout";

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MarketingLayout>{children}</MarketingLayout>;
}
