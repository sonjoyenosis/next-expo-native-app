import React, { useState } from "react";
import { useWorker } from "@koale/useworker";

const numbers = [...Array(5000000)].map((e) =>
  Math.round((Math.random() + 0.5) * 1000)
);

const sortNumbers = (nums: number[]) => nums.sort();

function NumberSortingUseWorker() {
  const [sortWorker] = useWorker(sortNumbers);

  const [someNumbers, setSomeNumbers] = useState(numbers);

  const runSort = async () => {
    console.log("Start");
    const result = await sortWorker(numbers); // non-blocking UI
    setSomeNumbers(result);
    console.log("End.");
  };

  return (
    <div>
      <p> {`${someNumbers.filter((v, i) => i % 123311 === 0)}`} </p>

      <button type="button" onClick={runSort}>
        Run Sort
      </button>

      <button type="button" onClick={() => setSomeNumbers(numbers)}>
        Randomize
      </button>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div>
      <div>UseWorker Test</div>
      <NumberSortingUseWorker />
    </div>
  );
}
