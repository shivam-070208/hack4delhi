"use client";

import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100 px-4">
      <div className="flex w-full max-w-md flex-col items-center">
        <img
          src="https://media.giphy.com/media/3og0IPMEeZ6jIR8IRE/giphy.gif"
          alt="Unauthorized GIF"
          className="mb-8 w-64 rounded-lg shadow-lg"
        />
        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          Unauthorized Access
        </h1>
        <p className="mb-6 text-center text-gray-600">
          You do not have permission to view this page.
          <br />
          Please log in or go back to the homepage.
        </p>
        <div className="flex gap-4">
          <Link
            href="/"
            className="rounded-lg bg-indigo-600 px-6 py-2 font-semibold text-white shadow transition hover:bg-indigo-700"
          >
            Home
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-indigo-600 bg-white px-6 py-2 font-semibold text-indigo-600 shadow transition hover:bg-indigo-50"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
