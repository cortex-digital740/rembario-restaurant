import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChefHat, Star, Clock, Calendar } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { useDishes } from '@/hooks/useDishes';

const features = [
  {
    icon: ChefHat,
    title: 'Expert Chefs',
    description: 'Our talented chefs bring years of culinary excellence to every dish'
  },
  {
    icon: Star,
    title: 'Premium Quality',
    description: 'We source only the finest, freshest ingredients for our kitchen'
  },
  {
    icon: Clock,
    title: 'Quick Service',
    description: 'Enjoy prompt service without compromising on quality'
  }
];

export default function Index() {
  const { data: dishes } = useDishes();
  const popularDishes = dishes?.slice(0, 3) || [];

  return (
    <PageTransition>
      <Header />
      <main>
        {/* Hero Section with Video Background */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          {/* Video Background */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              poster="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=1080&fit=crop"
            >
              <source
                src="https://cdn.pixabay.com/video/2020/07/30/45349-446234046_large.mp4"
                type="video/mp4"
              />
            </video>
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="container-custom relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="max-w-4xl mx-auto"
            >
              {/* Premium Tagline */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 mb-6"
              >
                <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-amber-400" />
                <span className="text-amber-400 font-medium text-sm md:text-base tracking-widest uppercase">
                  Fine Dining Experience
                </span>
                <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-amber-400" />
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-4 text-white"
              >
                Rimberio
              </motion.h1>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-white/90 mb-4 leading-relaxed font-light"
              >
                Experience Culinary Excellence
              </motion.p>

              {/* Premium Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="text-lg md:text-xl text-white/75 mb-10 leading-relaxed max-w-2xl mx-auto font-light"
              >
                Indulge in rich, complex flavors crafted by our award-winning culinary team.
                <span className="block mt-2 text-amber-400/80">
                  Every dish is a journey through tradition, innovation, and passion.
                </span>
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
              >
                {/* View Menu Button */}
                <Link to="/menu" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-lg px-10 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <ChefHat className="w-5 h-5" />
                    View Menu
                  </motion.button>
                </Link>

                {/* Book a Table Button */}
                <Link to="/reservations" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold text-lg px-10 py-4 rounded-full border border-white/30 backdrop-blur-sm transition-all duration-300 hover:border-white/50"
                  >
                    <Calendar className="w-5 h-5" />
                    Book a Table
                  </motion.button>
                </Link>
              </motion.div>

              {/* Decorative Element */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-12 flex justify-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-amber-400/60" />
                <div className="w-2 h-2 rounded-full bg-amber-400/40" />
                <div className="w-2 h-2 rounded-full bg-amber-400/20" />
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2"
            >
              <motion.div className="w-1.5 h-1.5 bg-white rounded-full" />
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="section-padding bg-card">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We pride ourselves on delivering an exceptional dining experience
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="text-center p-8 rounded-2xl bg-background border border-border"
                >
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6"
                  >
                    <feature.icon className="w-8 h-8" />
                  </motion.div>
                  <h3 className="font-heading text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Dishes */}
        {popularDishes.length > 0 && (
          <section className="section-padding">
            <div className="container-custom">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
              >
                <div>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">Popular Dishes</h2>
                  <p className="text-muted-foreground">Explore our most loved creations</p>
                </div>
                <Link to="/menu">
                  <motion.span
                    whileHover={{ x: 5 }}
                    className="inline-flex items-center gap-2 text-primary font-medium"
                  >
                    View Full Menu <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </Link>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-6">
                {popularDishes.map((dish, index) => (
                  <motion.div
                    key={dish.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="group cursor-pointer"
                  >
                    <div className="relative overflow-hidden rounded-2xl aspect-square mb-4">
                      <motion.img
                        src={dish.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop'}
                        alt={dish.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <span className="text-white font-heading text-xl font-semibold">{dish.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading text-lg font-semibold">{dish.name}</h3>
                      <span className="text-primary font-bold">${Number(dish.price).toFixed(2)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="section-padding bg-primary text-primary-foreground">
          <div className="container-custom text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                Ready to Dine With Us?
              </h2>
              <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                Reserve your table now and experience the finest cuisine
              </p>
              <Link to="/reservations">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 bg-background text-foreground px-8 py-4 rounded-full text-lg font-medium hover:bg-background/90 transition-colors"
                >
                  Reserve Now
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
}
