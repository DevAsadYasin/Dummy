import React from 'react';

interface PlaceholderProps {
  width: number;
  height: number;
  text?: string;
}

export const Placeholder: React.FC<PlaceholderProps> = ({ width, height, text }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100%" height="100%" fill="#e0e0e0" />
      {text && (
        <text
          x="50%"
          y="50%"
          fontFamily="Arial, sans-serif"
          fontSize="16"
          fill="#666"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {text}
        </text>
      )}
    </svg>
  );
};

