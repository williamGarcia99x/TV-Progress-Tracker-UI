import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;
  if (!token) {
    redirect("/");
  }

  return (
    <div className="pt-20">
      <NavigationMenu
        viewport={false}
        className="bg-cinematic-charcoal rounded-md p-2 text-heading-primary"
      >
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              color="yellow"
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/tracker/planning">Planning</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/tracker/watching">Watching</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/tracker/completed">Completed</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      {children}
    </div>
  );
}

export default Layout;
