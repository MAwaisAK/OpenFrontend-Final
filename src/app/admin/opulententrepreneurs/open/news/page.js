import AdminBody from "@/components/Admin_News";
export const metadata = {
  title: "News",
  description: "News",
  openGraph: {
    title: "News - OpEn",
    description: "News",
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
