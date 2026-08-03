import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface MarketFiltersProps {
  onSearch: (query: string) => void;
  onReset: () => void;
}

export function MarketFilters({ onSearch, onReset }: MarketFiltersProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(query.trim());
  };

  const handleReset = () => {
    setQuery("");
    onReset();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Buscar mercado</label>
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Nome, cidade ou CNPJ"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" onClick={handleReset}>
            Limpar
          </Button>
          <Button type="submit">Buscar</Button>
        </div>
      </form>
    </motion.div>
  );
}
