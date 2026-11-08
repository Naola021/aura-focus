import { Suspense } from "react";
import FocusPage from "@/components/focus/FocusPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#09090b]" />}>
      <FocusPage />
    </Suspense>
  );
}
