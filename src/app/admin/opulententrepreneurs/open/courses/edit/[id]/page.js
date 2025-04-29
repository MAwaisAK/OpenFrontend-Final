import AdminBody from "@/components/Course_Edit";
export const metadata = {
  title: "Edit Courses",
  description: "Courses",
  openGraph: {
    title: "Edit Courses - OpEn",
    description: "Courses",
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
