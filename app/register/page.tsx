"use client";
import { AuthForm } from "@/components/AuthForm";
import useAuthMutation from "@/lib/hooks/useAuthMutation";
import { GalleryVerticalEnd } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

function Register() {
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { isPending, mutateAsync: registerUser } = useAuthMutation("register");

  const onSubmit = async (formData: {
    username: string;
    password: string;
    confirmPassword?: string;
  }) => {
    //Verify that the password and confirm password fields match.
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    try {
      setErrorMessage(""); // Reset error message before registration attempt

      //Session is not returned on registration, so we don't store it in local storage.
      await registerUser({
        username: formData.username,
        password: formData.password,
      });

      router.push("/login"); // Redirect users to the login page after successful registration
    } catch (error: any) {
      setErrorMessage(error.message);
      // Handle login error (e.g., show an error message)
      console.error(error);
    }
  };

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
        <AuthForm
          title={"Welcome to Popcorn Watchers"}
          description={"Create an account to start tracking TV shows."}
          submitLabel={"Create Account"}
          onSubmit={onSubmit}
          isPending={isPending}
          showConfirmPassword
          errorMessage={errorMessage}
        />
      </div>
    </div>
  );
}

export default Register;
