import Settings from "@/components/Settings";
export const metadata = {
  title: "Settings",
  description: "Settings",
  openGraph: {
    title: "Settings - OpEn",
    description: "Settings",
    type: "website",
  },
};
export default function Admin() {
  return (
    <>
    <Settings/>
    </>
  );
}
