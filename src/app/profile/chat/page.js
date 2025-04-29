import Chat from "@/components/UserChat";
export const metadata = {
  title: "Chat",
  description: "Chat",
  openGraph: {
    title: "Chat - OpEn",
    description: "Chat",
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
