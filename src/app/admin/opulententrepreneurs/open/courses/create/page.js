import AdminBody from "@/components/Course_Create";
export const metadata = {
  title: "Create Courses",
  description: "Courses",
  openGraph: {
    title: "Create Courses - OpEn",
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
