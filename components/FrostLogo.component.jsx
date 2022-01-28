import React from "react";
import useSound from "use-sound";

export const FrostLogo = () => {
  const [play] = useSound("./audio/scream.opus");

  const frostImages = `img/FROST_LEGIBLE_GREEN.webp`;

  return (
    <div>
      <div className="w-full h-full relative">
        <img src={frostImages} alt="frost-children-logo" onClick={play} />
      </div>
    </div>
  );
};
