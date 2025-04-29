import MyTribes from "@/components/MyTribes";
export const metadata = {
  title: "MyTribes",
  description: "MyTribes",
  openGraph: {
    title: "MyTribes - OpEn",
    description: "MyTribes",
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
