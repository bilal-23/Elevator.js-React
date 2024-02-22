"use client";

import React from "react";
import up from "@/assets/up.png";
import Image from "next/image";
import { useElevator } from "@/hooks/useScroll";

export const ScrollToTop = () => {
  const { startElevating } = useElevator({});
  return (
    <div className="py-20 ">
      <div
        className="flex  cursor-pointer flex-col items-center justify-center gap-1"
        onClick={startElevating}
      >
        <Image src={up} alt="up arrow" width={50} height={50} />
        <p className="cursor-pointer text-base font-bold">Lessgoooo</p>
      </div>
    </div>
  );
};
