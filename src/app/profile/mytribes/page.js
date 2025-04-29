import MyTribes from "@/components/MyTribes";
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
