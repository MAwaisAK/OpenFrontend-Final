import AdminBody from "@/components/AdminLogin";
export const metadata = {
  title: "Admin",
  description: "Admin",
  openGraph: {
    title: "Admin - OpEn",
    description: "Admin",
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
