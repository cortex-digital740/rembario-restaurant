import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import FoodCard from '@/components/FoodCard';
import MenuFilters from '@/components/MenuFilters';
import { menuItems, priceRanges } from '@/data/menuData';

export default function Menu() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      // Search filter
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Price range filter
      if (selectedPriceRange !== 'all') {
        const range = priceRanges.find(r => r.id === selectedPriceRange);
        if (range && (item.price < range.min || item.price > range.max)) {
          return false;
        }
      }

      // Veg filter
      if (isVegOnly && !item.isVeg) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedPriceRange, isVegOnly]);

  return (
    <PageTransition>
      <Header />
      <main className="pt-20 md:pt-24 min-h-screen">
        <section className="section-padding">
          <div className="container-custom">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8 md:mb-12"
            >
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Our Menu</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover our carefully crafted dishes, made with fresh ingredients and culinary expertise
              </p>
            </motion.div>

            {/* Filters */}
            <MenuFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedPriceRange={selectedPriceRange}
              setSelectedPriceRange={setSelectedPriceRange}
              isVegOnly={isVegOnly}
              setIsVegOnly={setIsVegOnly}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
            />

            {/* Results count */}
            <motion.p
              key={filteredItems.length}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground mb-6"
            >
              Showing {filteredItems.length} {filteredItems.length === 1 ? 'dish' : 'dishes'}
            </motion.p>

            {/* Menu Grid */}
            <AnimatePresence mode="popLayout">
              {filteredItems.length > 0 ? (
                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {filteredItems.map((item, index) => (
                    <FoodCard key={item.id} item={item} index={index} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-16"
                >
                  <div className="text-6xl mb-4">🍽️</div>
                  <h3 className="font-heading text-xl font-semibold mb-2">No dishes found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or search query</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
}
