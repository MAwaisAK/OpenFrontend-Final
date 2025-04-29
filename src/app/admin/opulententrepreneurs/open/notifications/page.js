import AdminBody from "@/components/SendNotifications";
export const metadata = {
  title: "Notifications",
  description: "Notifications",
  openGraph: {
    title: "Notifications - OpEn",
    description: "Notifications",
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
