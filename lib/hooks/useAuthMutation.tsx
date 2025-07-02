import { useMutation } from "@tanstack/react-query";

type TokenResponse = {
  token: string;
  userId: number;
};

function useAuthMutation(type: "login" | "register") {
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (credentials: {
      username: string;
      password: string;
    }): Promise<TokenResponse | void> => {
      const response = await fetch(`${backendUrl}/auth/${type}`, {
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

  return { isPending, mutateAsync };
}

export default useAuthMutation;
