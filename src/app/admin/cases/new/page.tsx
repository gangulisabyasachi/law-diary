"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminNewCaseRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin");
  }, [router]);

  return null;
}
