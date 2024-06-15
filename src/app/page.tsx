"use client";
import CodeEditor from "@/components/CodeEditor";
import { useState } from "react";

export default function Home() {
  const [code, setCode] = useState("");
  return (
    <main className="flex min-h-screen flex-col bg-[rgb(30,30,30)]">
      <CodeEditor
        value={code}
        onValueChange={(value) => setCode(value)}
        language="tsx"
        className="h-screen w-screen"
      />
    </main>
  );
}
