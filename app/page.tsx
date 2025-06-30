"use client";

import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);

  console.log("WHERE IS THIS PRINTED");
  return (
    <div>
      <button className="p-2 bg-amber-500" onClick={() => setCount(count + 1)}>
        Click me
      </button>
      <p>{count}</p>
    </div>
  );
}
