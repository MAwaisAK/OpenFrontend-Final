import Chat from "@/components/TribeChat";
export const metadata = {
  title: "Tribe Chat",
  description: "Tribe Chat",
  openGraph: {
    title: "Tribe Chat - OpEn",
    description: "Tribe Chat",
    type: "website",
  },
};
export default function Admin() {
  return (
    <>
    <Chat/>
    </>
  );
}
