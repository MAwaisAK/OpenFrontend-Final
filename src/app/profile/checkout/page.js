import Checkout from "@/components/Checkout";
export const metadata = {
  title: "Checkout",
  description: "Checkout",
  openGraph: {
    title: "Checkout - OpEn",
    description: "Checkout",
    type: "website",
  },
};
export default function Admin() {
  return (
    <>
    <Checkout/>
    </>
  );
}
