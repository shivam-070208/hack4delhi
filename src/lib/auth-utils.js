import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";
import { forbidden, unauthorized,redirect  } from "next/navigation";

export const getSession = async () => {
  try {
    return await getServerSession(authOptions);
  } catch (err) {
    return null;
  }
};

export const authRequire = async (role = "user") => {
  const session = (await getSession()) || {};
  if (!session?.user) {
    unauthorized();
  }

  if (session?.user.role.toLowerCase() !== role.toLowerCase()) {
    forbidden();
  }
};

export const unauthRequire = async () => {
  const session = await getSession();
  if (session && session?.user) {
    if (session?.user.role === "admin") {
      redirect("/admin/dashboard");
    } else {
      redirect("/login");
    }
  }
};
