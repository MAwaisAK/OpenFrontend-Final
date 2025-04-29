import LoginBody from "@/components/Login";
export const metadata = {
  title: "Reset Password",
  description: "Reset Password",
  openGraph: {
    title: "Reset Password - OpEn",
    description: "Reset Password",
    type: "website",
  },
};
export default function Admin() {
  return (
    <>
    <LoginBody/>
    </>
  );
}
