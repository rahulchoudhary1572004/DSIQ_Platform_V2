import { useState, type ReactNode } from 'react';

// Type Definitions
type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

interface PositionClasses {
  [key: string]: string;
}

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: TooltipPosition;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
}) => {
  const [visible, setVisible] = useState<boolean>(false);

  const positionClasses: PositionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
  };

  const arrowClasses: PositionClasses = {
    top: '-bottom-1 left-1/2 -translate-x-1/2',
    right: '-left-1 top-1/2 -translate-y-1/2',
    bottom: '-top-1 left-1/2 -translate-x-1/2',
    left: '-right-1 top-1/2 -translate-y-1/2',
  };

  const handleMouseEnter = (): void => {
    setVisible(true);
  };

  const handleMouseLeave = (): void => {
    setVisible(false);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {visible && (
        <div className={`absolute z-50 ${positionClasses[position]}`}>
          <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg animate-fade-in">
            {content}
            <div
              className={`absolute w-2 h-2 bg-gray-800 transform rotate-45 ${arrowClasses[position]}`}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
