import React from "react";
import { BsInstagram, BsYoutube } from "react-icons/bs";
import { SiBigcartel } from "react-icons/si";
import { GiMusicalNotes } from "react-icons/gi";

const SocialIcon = ({ icon }) => {
  switch (icon) {
    case "Instagram":
      return <BsInstagram />;
    case "YouTube":
      return <BsYoutube />;
    case "Merch":
      return <SiBigcartel />;
    case "Music":
      return <GiMusicalNotes />;
  }
};

export default SocialIcon;
