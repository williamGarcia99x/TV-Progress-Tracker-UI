import { redirect } from "next/navigation";
import { cookies } from "next/headers";

async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;
  if (!token) {
    redirect("/");
  }

  return <div>{children}</div>;
}

export default Layout;
