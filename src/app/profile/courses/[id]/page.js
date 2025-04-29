import AdminBody from "@/components/CourseBody";
export const metadata = {
  title: "Course",
  description: "Course",
  openGraph: {
    title: "Course - OpEn",
    description: "Course",
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
