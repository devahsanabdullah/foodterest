"use client";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "@/i18n/navigation";

const schema = yup.object({
  name: yup.string().min(2, "Too short").required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(8, "Minimum 8 characters").required("Password is required"),
});

export default function SignUpPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    const { error } = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
      callbackURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "/",
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/");
  };

  const socialLogin = async (provider: "google" | "twitter") => {
    await authClient.signIn.social({ provider });
  };

  return (
    <div className="flex h-screen overflow-hidden w-full bg-background text-foreground">
      {/* Left image */}
      <div className="w-full hidden md:inline-block">
        <img
          className="h-full object-cover"
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/leftSideImage.png"
          alt="leftSideImage"
        />
      </div>

      {/* Right form */}
      <div className="w-full px-4 md:px-0 flex flex-col items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="md:w-96 w-full flex flex-col items-center justify-center bg-card text-card-foreground p-8 rounded-2xl shadow-[var(--shadow-soft)]"
        >
          <h2 className="text-4xl font-medium text-primary">Sign up</h2>
          <p className="text-sm text-muted-foreground mt-3">
            Create your Foodterest account
          </p>

          {/* Error banner (form level) */}
          {(errors.name || errors.email || errors.password) && (
            <p className="bg-destructive/10 text-destructive text-sm mt-4 p-2 rounded text-center">
              Please fix the errors below
            </p>
          )}

          {/* Google */}
          <button
            type="button"
            onClick={() => socialLogin("google")}
            className="w-full mt-8 bg-muted hover:bg-muted/70 flex items-center justify-center h-12 rounded-full transition"
          >
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
              alt="googleLogo"
            />
          </button>

          {/* Twitter */}
          <button
            type="button"
            onClick={() => socialLogin("twitter")}
            className="w-full mt-3 bg-muted hover:bg-muted/70 flex items-center justify-center h-12 rounded-full transition"
          >
            <img
              className="w-5 h-5"
              src="https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg"
              alt="twitter"
            />
          </button>

          <div className="flex items-center gap-4 w-full my-5">
            <div className="w-full h-px bg-border"></div>
            <p className="w-full text-nowrap text-sm text-muted-foreground text-center">
              or sign up with email
            </p>
            <div className="w-full h-px bg-border"></div>
          </div>

          {/* Name */}
          <div className="flex items-center w-full border border-border h-12 rounded-full pl-6 gap-2 bg-background">
            <input
              placeholder="Full Name"
              {...register("name")}
              className="bg-transparent text-foreground placeholder-muted-foreground outline-none text-sm w-full h-full"
            />
          </div>
          {errors.name && (
            <p className="text-sm text-destructive mt-1 w-full">
              {errors.name.message}
            </p>
          )}

          {/* Email */}
          <div className="flex items-center w-full border border-border h-12 rounded-full pl-6 gap-2 bg-background mt-6">
            <input
              placeholder="Email id"
              {...register("email")}
              className="bg-transparent text-foreground placeholder-muted-foreground outline-none text-sm w-full h-full"
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive mt-1 w-full">
              {errors.email.message}
            </p>
          )}

          {/* Password */}
          <div className="flex items-center mt-6 w-full border border-border h-12 rounded-full pl-6 gap-2 bg-background">
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="bg-transparent text-foreground placeholder-muted-foreground outline-none text-sm w-full h-full"
            />
          </div>
          {errors.password && (
            <p className="text-sm text-destructive mt-1 w-full">
              {errors.password.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-8 w-full h-11 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition shadow-[0_0_20px_var(--glow-primary)]"
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>

          <p className="text-muted-foreground text-sm mt-4">
            Already have an account?{" "}
            <Link className="text-accent hover:underline" href="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
