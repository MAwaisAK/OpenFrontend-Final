import Courses from "@/components/Courses";
export const metadata = {
  title: "My Courses",
  description: "My Courses",
  openGraph: {
    title: "My Courses - OpEn",
    description: "My Courses",
    type: "website",
  },
};
export default function Admin() {
  return (
    <>
    <Courses/>
    </>
  );
}
