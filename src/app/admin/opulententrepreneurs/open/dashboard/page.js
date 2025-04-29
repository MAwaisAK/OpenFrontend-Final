import AdminBody from "@/components/Admin_Body";
export const metadata = {
  title: "Dashboard",
  description: "Dashboard",
  openGraph: {
    title: "Dashboard - OpEn",
    description: "Dashboard",
    type: "website",
  },
};
export default function Admin() {
  return (
    <>
    <AdminBody/>
    </>
  );
}
