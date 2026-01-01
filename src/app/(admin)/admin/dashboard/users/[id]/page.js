import React, { Suspense } from "react";
import UserviewPage from "@/components/admin/user/UserviewPage";
import Loader from "@/components/common/loader";

export default async function Page({ params }) {
  const { id } = await params;
  return (
    <Suspense fallback={<Loader />}>
      <UserviewPage id={id} />
    </Suspense>
  );
}
