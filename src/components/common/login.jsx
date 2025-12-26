"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");

    const result = await signIn("credentials", {
      redirect: false,
      email: formValues.email,
      password: formValues.password,
    });
    setLoading(false);

    if (result?.error) {
      setFormError(result.error);
    } else if (!result?.ok) {
      setFormError("Login failed");
    } // On success, handle navigation or feedback if redirect: false
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    await signIn("google");
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <Form onSubmit={handleEmailPasswordLogin} className="space-y-4">
        <FormField>
          <FormItem>
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormControl>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                value={formValues.email}
                onChange={handleChange}
                required
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField>
          <FormItem>
            <FormLabel htmlFor="password">Password</FormLabel>
            <FormControl>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formValues.password}
                onChange={handleChange}
                required
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        {formError && <div className="text-sm text-red-500">{formError}</div>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </Form>
      <div className="my-6 flex items-center">
        <span className="flex-1 h-px bg-gray-300"></span>
        <span className="mx-4 text-gray-500 text-sm">OR</span>
        <span className="flex-1 h-px bg-gray-300"></span>
      </div>
      <Button
        type="button"
        variant="secondary"
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-2"
        disabled={loading}
      >
        <svg className="w-5 h-5" viewBox="0 0 48 48">
          <g>
            <path
              d="M44.5 20H24v8.5h11.9A10.5 10.5 0 1134 13a10.47 10.47 0 016.6 2.3l6.2-6.2A19.8 19.8 0 0024 4C12.96 4 4 12.96 4 24c0 11.04 8.96 20 20 20 10.37 0 19.09-7.87 19.92-18H44.5z"
              fill="#FFC107"
            />
            <path
              d="M6.3 14.15l7 5.13A12.93 12.93 0 0124 11c3.04 0 5.84 1.05 8.01 2.79l6.14-6.14C34.93 5.68 29.74 3.6 24 3.6 15.23 3.6 7.66 9.95 6.3 14.15z"
              fill="#FF3D00"
            />
            <path
              d="M24 44c5.52 0 10.63-1.99 14.56-5.44l-6.92-5.68A12.97 12.97 0 0124 37c-3.38 0-6.5-1.19-8.88-3.19l-6.86 6.7C8.1 39.85 15.55 44 24 44z"
              fill="#4CAF50"
            />
            <path
              d="M44 24c0-1.39-.13-2.72-.36-4H24v8.5h11.9A10.56 10.56 0 0034 37c-3.09 0-5.91-1.14-8.05-3l-.01.01-6.85 6.7C19.31 44.01 21.56 44 24 44c10.37 0 19.09-7.87 19.92-18H44z"
              fill="#1976D2"
            />
          </g>
        </svg>
        Continue with Google
      </Button>
    </div>
  );
}
