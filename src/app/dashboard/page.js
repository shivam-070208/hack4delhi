import { unauthRequire } from "@/lib/auth-utils";
import { unauthorized } from "next/navigation";

export default async function Page() {
  await unauthRequire();
  unauthorized();
  return null;
}
