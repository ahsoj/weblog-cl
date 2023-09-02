const Loading = () => {
  return (
    <div className="flex justify-center items-center">
      <svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        className="w-[100px] rotate-180 mr-6 h-[100px] mt-6 inline-block"
        viewBox="0 0 100 100"
        // enable-background="new 0 0 100 100"
        xmlSpace="preserve"
      >
        <rect
          fill="#4ade80"
          width="3"
          height="10"
          transform="translate(0) rotate(180 3 50)"
        >
          <animate
            attributeName="height"
            attributeType="XML"
            dur="1s"
            values="15; 50; 15"
            repeatCount="indefinite"
          />
        </rect>
        <rect
          x="17"
          fill="#fb923c"
          width="3"
          height="10"
          transform="translate(0) rotate(180 20 50)"
        >
          <animate
            attributeName="height"
            attributeType="XML"
            dur="1s"
            values="15; 50; 15"
            repeatCount="indefinite"
            begin="0.1s"
          />
        </rect>
        <rect
          x="40"
          fill="#3b82f6"
          width="3"
          height="10"
          transform="translate(0) rotate(180 40 50)"
        >
          <animate
            attributeName="height"
            attributeType="XML"
            dur="1s"
            values="15; 50; 15"
            repeatCount="indefinite"
            begin="0.3s"
          />
        </rect>
        <rect
          x="60"
          fill="#facc15"
          width="3"
          height="10"
          transform="translate(0) rotate(180 58 50)"
        >
          <animate
            attributeName="height"
            attributeType="XML"
            dur="1s"
            values="15; 50; 15"
            repeatCount="indefinite"
            begin="0.5s"
          />
        </rect>
        <rect
          x="80"
          fill="#dc2626"
          width="3"
          height="100"
          transform="translate(0) rotate(180 76 50)"
        >
          <animate
            attributeName="height"
            attributeType="XML"
            dur="1s"
            values="15; 50; 15"
            repeatCount="indefinite"
            begin="0.1s"
          />
        </rect>
      </svg>
    </div>
  );
};

export { Loading as default };
