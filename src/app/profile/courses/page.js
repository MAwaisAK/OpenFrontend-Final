import Courses from "@/components/Courses";
export const metadata = {
  title: "Courses",
  description: "Courses",
  openGraph: {
    title: "Courses - OpEn",
    description: "Courses",
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
