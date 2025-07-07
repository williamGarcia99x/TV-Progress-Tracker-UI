import { cookies } from "next/headers";
import LoginForm from "./LoginForm";
import { redirect } from "next/navigation";

async function Login() {
  const cookieStore = await cookies(); // Initialize cookies to check if user is logged in
  if (cookieStore.has("token")) {
    //If the user is already logged in, redirect them to the home page.

    redirect("/");
    return;
  }

  return (
    <div>
      <LoginForm />
    </div>
  );
}

export default Login;
