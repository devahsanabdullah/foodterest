import { authClient } from "./auth-client";

export async function signUpUser({
  email,
  password,
  name,
  image,
}: {
  email: string;
  password: string;
  name: string;
  image?: string;
}) {
  const { data, error } = await authClient.signUp.email(
    {
      email,       // user email address
      password,    // min 8 characters
      name,        // display name
      image,       // optional
      callbackURL: "/",
    },
    {
      onRequest: () => {
        // show loading
      },
      onSuccess: () => {
        // redirect to dashboard or sign-in
      },
      onError: (ctx) => {
        alert(ctx.error.message);
      },
    }
  );

  return { data, error };
}
