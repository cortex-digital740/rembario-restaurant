import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Banknote, Wallet, MapPin, Phone, User, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { useCart } from '@/context/CartContext';

const paymentMethods = [
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Pay securely with your card' },
  { id: 'cod', name: 'Cash on Delivery', icon: Banknote, description: 'Pay when you receive your order' },
  { id: 'upi', name: 'UPI / Wallet', icon: Wallet, description: 'Pay using UPI or digital wallet' },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearCart();
    navigate('/order-success');
  };

  if (items.length === 0) {
    navigate('/menu');
    return null;
  }

  return (
    <PageTransition>
      <Header />
      <main className="pt-20 md:pt-24 min-h-screen">
        <section className="section-padding">
          <div className="container-custom max-w-5xl">
            {/* Back Button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate('/cart')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Cart
            </motion.button>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading text-3xl md:text-4xl font-bold mb-8"
            >
              Checkout
            </motion.h1>

            <form onSubmit={handleSubmit}>
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {/* Delivery Details */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card-elevated p-6"
                  >
                    <h2 className="font-heading text-xl font-semibold mb-4">Delivery Details</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium mb-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Doe"
                          className="w-full input-styled"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium mb-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+1 (555) 123-4567"
                          className="w-full input-styled"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium mb-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          Delivery Address
                        </label>
                        <textarea
                          required
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="123 Main Street, Apt 4B, City, State 12345"
                          rows={3}
                          className="w-full input-styled resize-none"
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Payment Method */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card-elevated p-6"
                  >
                    <h2 className="font-heading text-xl font-semibold mb-4">Payment Method</h2>
                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <motion.label
                          key={method.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedPayment === method.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={selectedPayment === method.id}
                            onChange={(e) => setSelectedPayment(e.target.value)}
                            className="sr-only"
                          />
                          <div className={`p-3 rounded-full ${
                            selectedPayment === method.id ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                          }`}>
                            <method.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{method.name}</p>
                            <p className="text-sm text-muted-foreground">{method.description}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 ${
                            selectedPayment === method.id
                              ? 'border-primary bg-primary'
                              : 'border-muted-foreground'
                          } flex items-center justify-center`}>
                            {selectedPayment === method.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 bg-primary-foreground rounded-full"
                              />
                            )}
                          </div>
                        </motion.label>
                      ))}
                    </div>

                    {/* Card Details (Demo) */}
                    {selectedPayment === 'card' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-4 border-t border-border space-y-4"
                      >
                        <div>
                          <label className="text-sm font-medium mb-2 block">Card Number</label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="w-full input-styled"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Expiry</label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="w-full input-styled"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">CVV</label>
                            <input
                              type="text"
                              placeholder="123"
                              className="w-full input-styled"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                {/* Order Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="lg:col-span-1"
                >
                  <div className="card-elevated p-6 sticky top-24">
                    <h2 className="font-heading text-xl font-semibold mb-4">Order Summary</h2>
                    
                    <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                          </div>
                          <span className="text-sm font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-border pt-4 space-y-2">
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
                      <div className="h-px bg-border my-2" />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-primary">${(totalPrice * 1.1).toFixed(2)}</span>
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-6 btn-primary py-3 rounded-xl font-medium"
                    >
                      Place Order
                    </motion.button>

                    <p className="text-xs text-muted-foreground text-center mt-4">
                      By placing this order, you agree to our Terms of Service
                    </p>
                  </div>
                </motion.div>
              </div>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
}
