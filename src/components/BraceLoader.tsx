import React from 'react';

interface BraceLoaderProps {
  /** Cor das chaves {} */
  color?: string;
  /** Cor de fundo do container */
  background?: string;
}

const BRACE_PATHS = {
  left: 'M9,2 C5,2 5,5.5 5,7.5 C5,9.5 5,9.5 2,10 C5,10.5 5,10.5 5,12.5 C5,14.5 5,18 9,18',
  right:
    'M15,2 C19,2 19,5.5 19,7.5 C19,9.5 19,9.5 22,10 C19,10.5 19,10.5 19,12.5 C19,14.5 19,18 15,18',
};

type BoxAnimation = 'from-left' | 'from-right';

interface BoxConfig {
  className: string;
  animation: BoxAnimation;
  delaySeconds: number;
}

const BOXES: BoxConfig[] = [
  { className: 'box-1', animation: 'from-left', delaySeconds: 0 },
  { className: 'box-2', animation: 'from-right', delaySeconds: 1 },
  { className: 'box-3', animation: 'from-left', delaySeconds: 2 },
  { className: 'box-4', animation: 'from-right', delaySeconds: 3 },
];

const BraceIcon: React.FC<{ color: string }> = ({ color }) => (
  <div className="brace">
    <svg viewBox="0 0 24 20" xmlns="http://www.w3.org/2000/svg">
      <path d={BRACE_PATHS.left} stroke={color} />
      <path d={BRACE_PATHS.right} stroke={color} />
    </svg>
  </div>
);

const BraceLoader: React.FC<BraceLoaderProps> = ({ color = '#FF5C00', background = '#1a1a1a' }) => {
  return (
    <div className="brace-loader-wrapper" style={{ background }}>
      <div className="loader">
        {BOXES.map(({ className, animation, delaySeconds }) => (
          <div
            key={className}
            className={`box ${className}`}
            style={{
              animationName: animation,
              animationDuration: '4s',
              animationIterationCount: 'infinite',
              animationDelay: `${delaySeconds}s`,
            }}
          >
            <div className="side-left" />
            <div className="side-right" />
            <div className="side-top">
              <BraceIcon color={color} />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .brace-loader-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          width: 100%;
        }
        .loader {
          scale: 3;
          height: 50px;
          width: 40px;
        }
        .box {
          position: relative;
          opacity: 0;
          left: 10px;
        }
        .side-left {
          position: absolute;
          background-color: #A9A9A9;
          width: 19px;
          height: 5px;
          transform: skew(0deg, -25deg);
          top: 14px;
          left: 10px;
        }
        .side-right {
          position: absolute;
          background-color: #D3D3D3;
          width: 19px;
          height: 5px;
          transform: skew(0deg, 25deg);
          top: 14px;
          left: -9px;
        }
        .side-top {
          position: absolute;
          background-color: #fff;
          width: 20px;
          height: 20px;
          rotate: 45deg;
          transform: skew(-20deg, -20deg);
        }
        .brace {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .brace svg {
          width: 15px;
          height: 13px;
          overflow: visible;
        }
        .brace path {
          fill: none;
          stroke-width: 2.6;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        @keyframes from-left {
          0%   { z-index: 20; opacity: 0; translate: -20px -6px; }
          20%  { z-index: 10; opacity: 1; translate: 0px 0px; }
          40%  { z-index: 9;  translate: 0px 4px; }
          60%  { z-index: 8;  translate: 0px 8px; }
          80%  { z-index: 7;  opacity: 1; translate: 0px 12px; }
          100% { z-index: 5;  translate: 0px 30px; opacity: 0; }
        }
        @keyframes from-right {
          0%   { z-index: 20; opacity: 0; translate: 20px -6px; }
          20%  { z-index: 10; opacity: 1; translate: 0px 0px; }
          40%  { z-index: 9;  translate: 0px 4px; }
          60%  { z-index: 8;  translate: 0px 8px; }
          80%  { z-index: 7;  opacity: 1; translate: 0px 12px; }
          100% { z-index: 5;  translate: 0px 30px; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default BraceLoader;
