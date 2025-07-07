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
      <Card className="bg-cinematic-charcoal">
        <CardHeader className="text-center text-heading-secondary">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="text-gray-300">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="">
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="username" className="text-secondary">
                    Username
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="bg-gray-300"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password" className="text-secondary">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    required
                    className="bg-gray-300"
                  />
                </div>
                {showConfirmPassword && (
                  <div className="grid gap-3">
                    <Label
                      htmlFor="confirm-password"
                      className="text-heading-secondary"
                    >
                      Confirm Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      name="confirm-password"
                      required
                      className="bg-gray-300"
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
                <Button
                  type="submit"
                  className="w-full bg-button-gold font-bold text-salty-white text-lg"
                  disabled={isPending}
                >
                  {submitLabel}
                </Button>
              </div>
              {/* display footer if given */}
              {Footer && <>{Footer}</>}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
