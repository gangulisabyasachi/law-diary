"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminCaseDetailRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin");
  }, [router]);

  return null;
}
