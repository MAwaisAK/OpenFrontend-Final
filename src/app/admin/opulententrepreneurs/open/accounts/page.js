import AdminBody from "@/components/Accounts";
export const metadata = {
  title: "Admin",
  description: "Admin Page",
  openGraph: {
    title: "Admin - OpEn",
    description: "Admin Page",
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
