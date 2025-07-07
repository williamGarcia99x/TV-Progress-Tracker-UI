"use client";

import { logoutUser } from "@/lib/trackerActions";
import Link from "next/link";

import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { CiLogout } from "react-icons/ci";
import { TbClipboardCheck, TbHome2 } from "react-icons/tb";

function Sidebar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const path = usePathname();

  if (path === "/login" || path === "/register") {
    return null;
  }

  const handleLogout = async () => {
    if (!isLoggedIn) {
      toast("You are already logged out.");
      return;
    }

    await logoutUser();

    toast.success("Logged out.");
  };

  return (
    <div className="relative basis-[100px] shrink-0 ">
      <aside className="absolute top-0 bottom-0 left-0 text-heading-secondary w-full ">
        <div className="h-full bg-cinematic-charcoal">
          <div className="h-full flex flex-col">
            <nav className="flex flex-col items-center pt-15 gap-y-6">
              <Link href="/">
                <TbHome2 size={40} className="text-button-gold " />
              </Link>

              <Link href="/tracker/watching">
                <TbClipboardCheck
                  size={40}
                  className="text-button-gold "
                ></TbClipboardCheck>
              </Link>
            </nav>

            <div className="mt-auto w-full flex justify-center">
              <form action={handleLogout}>
                <button type="submit" className="mb-4 ">
                  <CiLogout
                    size={40}
                    className="text-button-gold hover:text-theater-curtain"
                  />
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
