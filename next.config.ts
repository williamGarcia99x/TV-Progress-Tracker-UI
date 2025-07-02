// The purpose of this file is to configure the Next.js application.

module.exports = {
  //Below, we are setting the remote patterns for images which allows us to load images from a specific hostname.
  // This is useful for loading images from a CDN or an external image service like TMDB
  images: {
    remotePatterns: [
      //This is one of the remote patterns that allows us to load images from TMDB.
      //All images fetched with the Image component require a remote pattern to be defined in the next.config.js file.
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_IMAGE_HOSTNAME || "image.tmdb.org",
        pathname: "/t/p/**",
        port: "",
        search: "",
      },
    ],
  },
};
