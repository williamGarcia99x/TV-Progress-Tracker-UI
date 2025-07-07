"use client";
import Link from "next/link";
import { TbClipboardCheck, TbHome } from "react-icons/tb";
import { CiLogout } from "react-icons/ci";

import { logoutUser } from "@/lib/trackerActions";
import { usePathname } from "next/navigation";

function SideBarContent({ isLoggedIn }: { isLoggedIn: boolean }) {
  const path = usePathname();

  if (path === "/login" || path === "/register") {
    return null;
  }

  return (
    <div className="h-full bg-cinematic-charcoal">
      <div className="h-full flex flex-col">
        <nav className="flex flex-col items-center pt-15 gap-y-6">
          <Link href="/">
            <TbHome size={40} className="text-button-gold "></TbHome>
          </Link>
          {isLoggedIn && (
            <Link href="/tracker/watching">
              <TbClipboardCheck
                size={40}
                className="text-button-gold "
              ></TbClipboardCheck>
            </Link>
          )}
        </nav>

        {isLoggedIn && (
          <div className="mt-auto w-full flex justify-center">
            <form action={logoutUser}>
              <button type="submit" className="mb-4 ">
                <CiLogout
                  size={40}
                  className="text-button-gold hover:text-theater-curtain"
                />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default SideBarContent;
