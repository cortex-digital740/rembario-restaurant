import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { categories, priceRanges } from '@/data/menuData';

interface MenuFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedPriceRange: string;
  setSelectedPriceRange: (range: string) => void;
  isVegOnly: boolean;
  setIsVegOnly: (veg: boolean) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

export default function MenuFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedPriceRange,
  setSelectedPriceRange,
  isVegOnly,
  setIsVegOnly,
  showFilters,
  setShowFilters,
}: MenuFiltersProps) {
  const hasActiveFilters = selectedCategory !== 'all' || selectedPriceRange !== 'all' || isVegOnly || searchQuery;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPriceRange('all');
    setIsVegOnly(false);
  };

  return (
    <div className="mb-8">
      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full input-styled pl-12"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${
            showFilters || hasActiveFilters
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-accent" />
          )}
        </motion.button>
      </div>

      {/* Expanded Filters */}
      <motion.div
        initial={false}
        animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="bg-card rounded-xl p-4 md:p-6 border border-border space-y-6">
          {/* Categories */}
          <div>
            <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">Category</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  <span>{category.icon}</span>
                  {category.name}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">Price Range</h4>
            <div className="flex flex-wrap gap-2">
              {priceRanges.map((range) => (
                <motion.button
                  key={range.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPriceRange(range.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedPriceRange === range.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {range.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Veg Toggle & Clear */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsVegOnly(!isVegOnly)}
              className={`flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isVegOnly
                  ? 'bg-green-600 text-white'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              <div className="w-4 h-4 border-2 border-current rounded flex items-center justify-center">
                <div className={`w-2 h-2 rounded-full transition-colors ${isVegOnly ? 'bg-white' : 'bg-green-600'}`} />
              </div>
              Vegetarian Only
            </motion.button>

            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
                Clear all filters
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
