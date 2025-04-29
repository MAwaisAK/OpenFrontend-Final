import AdminBody from "@/components/Admin_Accouncements";
export const metadata = {
  title: "Annoicements",
  description: "Create Annoicements",
  openGraph: {
    title: "Annoicements - OpEn",
    description: "Create Annoicements",
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
