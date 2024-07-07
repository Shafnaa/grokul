import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AppContainer from "@/components/AppContainer/AppContainer";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default async function Home() {
  return (
    <>
      {/* <h1>{message}</h1> */}
      <DefaultLayout>
        <AppContainer />
      </DefaultLayout>
    </>
  );
}
