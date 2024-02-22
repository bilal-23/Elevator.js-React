import Image, { StaticImageData } from "next/image";
import React from "react";
interface Props {
  text: string;
  image: StaticImageData;
  id: number;
}

export const Section = ({ text, image, id }: Props) => {
  return (
    <section
      id={id + ""}
      className="flex min-h-[350px] w-full flex-col items-center gap-10 py-16"
    >
      <div className="relative flex items-center justify-center">
        <Image
          src={image}
          alt="section image"
          width={300}
          height={400}
          className="h-auto w-[100px]"
        />
      </div>
      <p className="text-lg font-medium">{text}</p>
    </section>
  );
};
