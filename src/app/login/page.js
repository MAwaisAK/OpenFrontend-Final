import LoginBody from "@/components/Login";
export const metadata = {
  title: "Login",
  description: "Login",
  openGraph: {
    title: "Login - OpEn",
    description: "Login",
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
