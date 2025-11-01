import { FiX } from "react-icons/fi";

// Type definitions
interface SelectionTagProps {
  label: string;
  onRemove: () => void;
  countryCode?: string;
  className?: string;
}

export default function SelectionTag({ 
  label, 
  onRemove, 
  countryCode,
  className 
}: SelectionTagProps): React.ReactElement {
  return (
    <div className={`relative flex items-center bg-peach text-accent-magenta rounded-full px-3 py-1 mr-2 mb-2 text-sm hover:bg-cream ${className || ""}`}>
      {countryCode && (
        <span className="absolute -top-1 -left-1 bg-primary-orange text-white text-[12px] font-semibold rounded-full px-1 py-0">
          {countryCode}
        </span>
      )}
      <span className="mr-1 pl-4">{label}</span>
      <button
        className="ml-1 text-accent-magenta hover:text-danger-red focus:outline-none"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
      >
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );
}
