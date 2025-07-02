"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button className="p-2 bg-amber-500" onClick={() => setCount(count + 1)}>
        Click me
      </button>
      <Button onClick={() => setCount((state) => state + 1)}>
        Hello World
      </Button>
      <p>{count}</p>
    </div>
  );
}
