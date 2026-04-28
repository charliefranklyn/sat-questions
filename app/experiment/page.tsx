"use client";
import { useRouter } from "next/navigation";
import InteractiveLessonExp from "@/components/InteractiveLessonExp";

export default function ExperimentPage() {
  const router = useRouter();
  return (
    <InteractiveLessonExp
      onClose={() => router.push("/mathematics")}
      onComplete={() => {}}
    />
  );
}
