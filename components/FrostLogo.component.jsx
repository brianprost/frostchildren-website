import React from "react";
import useSound from "use-sound";

export const FrostLogo = () => {
  const [play, { stop, isPlaying }] = useSound(
    "./audio/how_to_summon_an_abrys_v2.m4a"
  );

  // make sure that it doesn't play twice
  function playAudio() {
    if (!isPlaying) {
      play();
    }
  }
  const frostImages = `img/abrys.webp`;

  return (
    <div className="w-auto h-auto">
      <img src={frostImages} alt="frost-children-logo" onClick={() => playAudio()} />
    </div>
  );
};
