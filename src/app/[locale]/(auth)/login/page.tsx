"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";

export default function Example() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { error: loginError } = await authClient.signIn.email({
        email,
        password,
        callbackURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "/",
      });
      if (loginError) return setError(loginError.message as string);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const socialLogin = async (provider: "google" | "twitter") => {
    setLoading(true);
    setError("");
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "/",
      });
    } catch (err: any) {
      setError(err.message || "Social login failed");
      setLoading(false);
    }
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
      <div className="w-full flex flex-col items-center justify-center">
        <form
          onSubmit={handleEmailLogin}
          className="md:w-96 w-80 flex flex-col items-center justify-center bg-card text-card-foreground p-8 rounded-2xl shadow-[var(--shadow-soft)]"
        >
          <h2 className="text-4xl font-medium text-primary">Sign in</h2>
          <p className="text-sm text-muted-foreground mt-3">
            Welcome back! Please sign in to continue
          </p>

          {error && (
            <p className="bg-destructive/10 text-destructive text-sm mt-4 p-2 rounded text-center">
              {error}
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
              or sign in with email
            </p>
            <div className="w-full h-px bg-border"></div>
          </div>

          {/* Email */}
          <div className="flex items-center w-full border border-border h-12 rounded-full pl-6 gap-2 bg-background">
            <input
              type="email"
              placeholder="Email id"
              className="bg-transparent text-foreground placeholder-muted-foreground outline-none text-sm w-full h-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center mt-6 w-full border border-border h-12 rounded-full pl-6 gap-2 bg-background">
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent text-foreground placeholder-muted-foreground outline-none text-sm w-full h-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="w-full flex items-center justify-between mt-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <input className="h-5 accent-primary" type="checkbox" id="checkbox" />
              <label className="text-sm" htmlFor="checkbox">
                Remember me
              </label>
            </div>
            <a className="text-sm underline text-accent hover:opacity-80" href="#">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full h-11 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition shadow-[0_0_20px_var(--glow-primary)]"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-muted-foreground text-sm mt-4">
            Don’t have an account?{" "}
            <Link className="text-accent hover:underline" href="/signup">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
