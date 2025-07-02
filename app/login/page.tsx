"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";

import useAuthMutation from "@/lib/hooks/useAuthMutation";

function Login() {
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { isPending, mutateAsync: loginUser } = useAuthMutation("login");

  //Function that is excuted when the user submits the login form.
  //It calls the loginUser function from the useLogin hook and handles the response.
  //If the login is successful, it stores the session in local storage and redirects the user to the home page.
  //If the login fails, it sets the error message to be displayed to the user.

  const onSubmit = async (formData: {
    username: string;
    password: string;
    confirmPassword?: string;
  }) => {
    try {
      setErrorMessage(""); // Reset error message before login attempt
      const session = await loginUser({
        username: formData.username,
        password: formData.password,
      });
      // Redirect users to the home page.
      localStorage.setItem("session", JSON.stringify(session));
      router.push("/"); // Redirect users to the home page.
    } catch (error: any) {
      setErrorMessage(error.message);
      // Handle login error (e.g., show an error message)
      console.error(error);
    }
  };

  const Footer = () => (
    <div className="text-center text-sm">
      Don&apos;t have an account?{" "}
      <a
        onClick={() => router.push("/register")}
        className="underline underline-offset-4 hover:cursor-pointer"
      >
        Sign up
      </a>
    </div>
  );

  // Check if a session exists in local storage when the component mounts
  // If a session exists, redirect to the home page. This prevents users from accessing the login page if they are already logged in.
  useEffect(() => {
    const session = localStorage.getItem("session");
    if (session) {
      // If a session exists, redirect to the home page
      router.push("/");
    }
  }, [router]);

  return (
    <div className="bg-gray-300 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            {/* Replace with small icon of popcorn */}
            <GalleryVerticalEnd className="size-4" />
          </div>
          Popcorn Watchers
        </div>
        {/* <LoginForm /> */}
        <AuthForm
          title={"Welcome back"}
          description={"Login to your account to start tracking TV shows."}
          submitLabel={"Login"}
          onSubmit={onSubmit}
          isPending={isPending}
          Footer={<Footer />}
          showConfirmPassword={false}
          errorMessage={errorMessage}
        />
      </div>
    </div>
  );
}

export default Login;
