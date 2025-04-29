import MyTribes from "@/components/UsersPage";
export const metadata = {
  title: "User Page",
  description: "User Page",
  openGraph: {
    title: "User Page - OpEn",
    description: "User Page",
    type: "website",
  },
};
export default function Admin() {
  return (
    <>
    <MyTribes/>
    </>
  );
}
