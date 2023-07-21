import { type SyntheticEvent, useState, useEffect } from "react";
import { LifebuoyIcon as LifebuoyIconSolid } from "@heroicons/react/24/solid";
import { LifebuoyIcon as LifebuoyIconOut } from "@heroicons/react/24/outline";
export default function RellyButton({
  handleRelly,
  id,
  likedByUser,
  className,
  onClickColor,
  value,
}: RellyButtonProps) {
  const [shouldBeAnimated, setShouldBeAnimated] = useState(false);
  var animate = function (e: SyntheticEvent<HTMLButtonElement>) {
    setShouldBeAnimated(true);
    setTimeout(() => {
      setShouldBeAnimated(false);
    }, 500);
    handleRelly(id, value);
  };

  return (
    <button
      onClick={animate}
      className={`bubbly-button justify-self-end ${
        shouldBeAnimated ? "animate" : ""
      } ${className}`}
    >
      <span
        className={`flex items-center text-center ${
          shouldBeAnimated ? "text-[#ff0081]" : "text-white opacity-75"
        } transition-all duration-200 ease-in`}
      >
        <LifebuoyIconOut className={`mr-1 h-5  w-5`} />
        {value}
      </span>
    </button>
  );
}
