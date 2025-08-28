import { useState, useRef, useEffect } from "react";

interface DropdownSelectProps {
  data: string[];
  onSelect?: (selectedItem: string) => void;
  placeholder?: string;
  className?: string;
}

export const DropdownSelect = ({
  data,
  onSelect,
  placeholder = "Selecione",
  className = "",
}: DropdownSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (item: string) => {
    setSelected(item);
    setIsOpen(false);
    if (onSelect) {
      onSelect(item);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, item: string) => {
    if (e.key === "Enter" || e.key === " ") {
      handleSelect(item);
    }
  };

  return (
    <div 
      className={`relative inline-block text-left ${className}`}
      ref={dropdownRef}
    >
      <button
        onClick={toggleDropdown}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleDropdown();
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`text-white bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center justify-between w-full dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800 ${className}`}
        type="button"
      >
        <span className="truncate">{selected || placeholder}</span>
        <svg
          className={`w-2.5 h-2.5 ms-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute z-30 mt-1 w-full bg-white divide-y divide-zinc-100 rounded-lg shadow-lg dark:bg-zinc-700"
          role="listbox"
        >
          <ul className="py-1 text-sm text-zinc-700 dark:text-zinc-200 max-h-60 overflow-auto">
            {data.map((item, index) => (
              <li 
                key={index} 
                role="option"
                aria-selected={selected === item}
                className={`px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-600 dark:hover:text-white cursor-pointer ${selected === item ? "bg-teal-100 dark:bg-teal-800" : ""}`}
                onClick={() => handleSelect(item)}
                onKeyDown={(e) => handleKeyDown(e, item)}
                tabIndex={0}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};