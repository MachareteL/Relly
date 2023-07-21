import { type SyntheticEvent, useState } from "react";
import { LifebuoyIcon as LifebuoyIconSolid } from "@heroicons/react/24/solid";
import { LifebuoyIcon as LifebuoyIconOut } from "@heroicons/react/24/outline";
export default function RellyButton({
  handleRelly,
  id,
  likedByUser,
  className
}: RellyButtonProps) {
  const [shouldBeAnimated, setShouldBeAnimated] = useState(false);
  var animate = function (e: SyntheticEvent<HTMLButtonElement>) {
    setShouldBeAnimated(true);
    setTimeout(() => {
      setShouldBeAnimated(false);
    }, 500);
  };
  return (
    <button
      onClick={animate}
      className={`bubbly-button ${shouldBeAnimated ? "animate" : ""} ${className}`}
    >
      {likedByUser ? (
        <LifebuoyIconSolid className="h-5 w-5" />
      ) : (
        <LifebuoyIconOut className="h-5 w-5 " />
      )}
    </button>
  );
}
