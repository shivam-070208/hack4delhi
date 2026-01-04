import React from "react";
const GlassSurface = () => {
  return (
    <svg
      className="w-0 h-0 "
      viewBox="0 0 220 220"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="displacementFilter">
          <feImage
            x="0"
            y="0"
            width="100%"
            height="100%"
            preserveAspectRatio="none"
            result="map"
            href="data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20384%2064%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22purple-grad%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%239b5de5%22/%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23f15bb5%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%22384%22%20height%3D%2264%22%20rx%3D%2212%22%20fill%3D%22url(%23purple-grad)%22/%3E%3Cellipse%20cx%3D%22192%22%20cy%3D%2232%22%20rx%3D%2250%22%20ry%3D%2215%22%20fill%3D%22%23fee440%22%20fill-opacity%3D%220.15%22%20/%3E%3C/svg%3E"
          ></feImage>
          <feTurbulence
            type="turbulence"
            in="map"
            baseFrequency="0.1"
            numOctaves="8"
            result="turbulence"
          />
          <feDisplacementMap
            in2="turbulence"
            in="SourceGraphic"
            scale="-10"
            xChannelSelector="G"
            yChannelSelector="G"
            result="displacement"
          />
          <feGaussianBlur
            in="displacement"
            in2="map"
            stdDeviation="0.8"
            result="blurred"
          />
          <feMerge>
            <feMergeNode in="blurred" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
};

export default GlassSurface;