"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JSX } from "react";

type AuthFormProps = {
  title: string;
  description: string;
  submitLabel: string;
  onSubmit: (formData: {
    username: string;
    password: string;
    confirmPassword?: string;
  }) => Promise<void>;
  showConfirmPassword?: boolean;
  errorMessage?: string;

  isPending: boolean;
  Footer?: JSX.Element;
} & React.ComponentProps<"div">;

export function AuthForm({
  title,
  description,
  submitLabel,
  onSubmit,
  showConfirmPassword = false,
  errorMessage,
  isPending = false,
  Footer = null,
}: AuthFormProps) {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    onSubmit({ username, password, confirmPassword });
  };
  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader className="text-center ">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" name="username" type="text" required />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    required
                  />
                </div>
                {showConfirmPassword && (
                  <div className="grid gap-3">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      name="confirm-password"
                      required
                    />
                  </div>
                )}
                <p
                  className={cn(
                    "invisible text-sm text-red-500 text-center",
                    !isPending && errorMessage && "visible"
                  )}
                >
                  {errorMessage || "placeholder"}
                  {/* Placeholder text is there so that the other elements don't shift */}
                </p>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {submitLabel}
                </Button>
              </div>
              {/* display footer if given */}
              {Footer && <>{Footer}</>}
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
