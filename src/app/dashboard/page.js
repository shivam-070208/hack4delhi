
import { unauthRequire } from "@/lib/auth-utils";
import { notFound } from "next/navigation";

export default async function Page() {
    await unauthRequire()
    notFound();
    return null;
}