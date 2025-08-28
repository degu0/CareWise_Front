import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";

interface SearchInputProps {
  onSearch?: (term: string) => void;
}

export const SearchInput = ({ onSearch }: SearchInputProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    const trimmed = query.trim();
    if (trimmed) {
      if (onSearch) onSearch(trimmed);
      saveToSearchHistory(trimmed);
      navigate(`/pesquisa/${trimmed}`);
    }
  };

  return (
    <div className="w-full">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Pesquisar pacientes"
          className="w-full pl-12 pr-4 py-3 border border-zinc-300 bg-white rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <button
          className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-600 hover:text-teal-700 transition-colors"
          onClick={handleSearch}
        >
          <IoIosSearch size={22} />
        </button>
      </div>
    </div>
  );
};
function saveToSearchHistory(trimmed: string) {
  throw new Error("Function not implemented.");
}

