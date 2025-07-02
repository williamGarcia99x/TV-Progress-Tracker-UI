import { useMutation } from "@tanstack/react-query";
import { error } from "console";

type TokenResponse = {
  token: string;
  userId: number;
};

//write documentation for this function
/**
 * useLogin is a custom hook that provides functionality to log in a user.
 * It uses the `useMutation` hook from `@tanstack/react-query` to handle
 * the login request to the backend.
 * @returns An object containing:
 * - `isPending`: A boolean indicating if the login request is currently pending.
 * - `loginUser`: A function that takes user credentials (username and password)
 *   and returns a promise that resolves to a `TokenResponse` containing the user's token and
 *   user ID upon successful login.
 */
function useLogin() {
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const { isPending, mutateAsync: loginUser } = useMutation({
    mutationFn: async (credentials: {
      username: string;
      password: string;
    }): Promise<TokenResponse> => {
      const response = await fetch(`${backendUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      //In the case of an error, the backends sends a response with a 4xx or 5xx status code
      //and an error message in the response body.
      if (!response.ok) {
        //Check if the response is due to client error or server error. If due to client error
        if (response.status >= 400 && response.status < 500) {
          const errorText = await response.text();
          throw new Error(errorText);
        } else {
          throw new Error(
            "An unexpected error occurred. Please try again later."
          );
        }
      }

      return response.json();
    },
  });

  return { isPending, loginUser };
}

export default useLogin;
