import React from "react";
import useSound from "use-sound";

export const FrostLogo = () => {
  const [play] = useSound("./audio/how_to_summon_an_abrys_v2.m4a");

  const frostImages = `img/abrys.webp`;

  return (
    <div className="w-auto h-auto">
      <img src={frostImages} alt="frost-children-logo" onClick={play} />
    </div>
  );
};
