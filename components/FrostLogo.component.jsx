import React from "react";
import useSound from "use-sound";

export const FrostLogo = () => {
  const [play] = useSound("./audio/scream.opus");

  const frostImages = `img/abrys.webp`;

  return (
    <div className="w-auto h-auto">
      <img src={frostImages} alt="frost-children-logo" onClick={play} />
    </div>
  );
};
