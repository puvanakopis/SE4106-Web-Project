import React from "react";

const GoogleMapEmbed = () => {
  return (
    <div className="w-full h-[300px] md:w-[600px] mx-auto border-0 shadow-lg rounded-xl overflow-hidden">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.4517358854396!2d80.78464357448158!3d6.7145965209142044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae38a5d15e55917%3A0x92bb8770edf29b53!2sSabaragamuwa%20University%20of%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1748275157732!5m2!1sen!2slk"
        className="w-full h-full"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Sabaragamuwa University of Sri Lanka"
      ></iframe>
    </div>
  );
};

export default GoogleMapEmbed;
