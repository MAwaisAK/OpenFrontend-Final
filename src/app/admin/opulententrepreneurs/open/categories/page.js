import AdminBody from "@/components/Categories";
export const metadata = {
  title: "Categories",
  description: "Categories",
  openGraph: {
    title: "Categories - OpEn",
    description: "Categories",
    url: "https://yourcompany.com/privacy-policy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};
export default function Admin() {
  return (
    <>
    <AdminBody/>
    </>
  );
}
