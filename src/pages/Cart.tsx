import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { useCart } from '@/context/CartContext';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  return (
    <PageTransition>
      <Header />
      <main className="pt-20 md:pt-24 min-h-screen">
        <section className="section-padding">
          <div className="container-custom max-w-4xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-8"
            >
              <ShoppingBag className="w-8 h-8 text-primary" />
              <h1 className="font-heading text-3xl md:text-4xl font-bold">Your Cart</h1>
              {totalItems > 0 && (
                <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                  {totalItems} items
                </span>
              )}
            </motion.div>

            {items.length > 0 ? (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="card-elevated p-4 flex gap-4"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2">
                          <h3 className="font-heading font-semibold truncate">{item.name}</h3>
                          <span className="font-bold text-primary whitespace-nowrap">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          ${item.price.toFixed(2)} each
                        </p>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </motion.button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </motion.button>
                          </div>

                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Order Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="lg:col-span-1"
                >
                  <div className="card-elevated p-6 sticky top-24">
                    <h2 className="font-heading text-xl font-semibold mb-4">Order Summary</h2>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Delivery</span>
                        <span className="text-green-600">Free</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax (10%)</span>
                        <span>${(totalPrice * 0.1).toFixed(2)}</span>
                      </div>
                      <div className="h-px bg-border my-4" />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-primary">${(totalPrice * 1.1).toFixed(2)}</span>
                      </div>
                    </div>

                    <Link to="/checkout">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full btn-primary flex items-center justify-center gap-2 py-3 rounded-xl font-medium"
                      >
                        Proceed to Checkout
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </Link>

                    <Link to="/menu">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-3 flex items-center justify-center gap-2 py-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Continue Shopping
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="font-heading text-2xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">Add some delicious dishes to get started</p>
                <Link to="/menu">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary px-8 py-3 rounded-full font-medium"
                  >
                    Browse Menu
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
}
