import MyTribes from "@/components/UserMyTribes";
export const metadata = {
  title: "My Tribes",
  description: "My Tribes",
  openGraph: {
    title: "My Tribes - OpEn",
    description: "My Tribes",
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
