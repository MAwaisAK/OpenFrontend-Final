import AdminBody from "@/components/Admin_UserPrompts";
export const metadata = {
  title: "Prompts",
  description: "Prompts",
  openGraph: {
    title: "Prompts - OpEn",
    description: "Prompts",
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
