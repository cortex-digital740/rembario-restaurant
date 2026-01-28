import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Home, FileText } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';

export default function OrderSuccess() {
  useEffect(() => {
    // Confetti effect or celebration animation could be added here
  }, []);

  const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;

  return (
    <PageTransition>
      <Header />
      <main className="pt-20 md:pt-24 min-h-screen flex items-center">
        <section className="section-padding w-full">
          <div className="container-custom max-w-2xl text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-success/10 text-success mb-8"
            >
              <CheckCircle className="w-12 h-12" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-heading text-3xl md:text-4xl font-bold mb-4"
            >
              Order Placed Successfully!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-muted-foreground mb-2"
            >
              Thank you for your order. We're preparing your delicious food!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="inline-block bg-card border border-border rounded-xl px-6 py-4 mb-8"
            >
              <p className="text-sm text-muted-foreground mb-1">Order ID</p>
              <p className="font-mono text-lg font-semibold text-primary">{orderId}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="card-elevated p-6 mb-8 text-left"
            >
              <h3 className="font-heading font-semibold mb-4">What's Next?</h3>
              <div className="space-y-4">
                {[
                  { step: 1, text: 'You will receive an order confirmation email shortly' },
                  { step: 2, text: 'Our chefs are preparing your order with care' },
                  { step: 3, text: 'Your food will be delivered in 30-45 minutes' },
                ].map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-medium flex items-center justify-center text-sm">
                      {item.step}
                    </span>
                    <p className="text-muted-foreground">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary flex items-center justify-center gap-2 px-8 py-3 rounded-full font-medium"
                >
                  <Home className="w-4 h-4" />
                  Back to Home
                </motion.button>
              </Link>
              <Link to="/menu">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-outline flex items-center justify-center gap-2 px-8 py-3 rounded-full font-medium"
                >
                  <FileText className="w-4 h-4" />
                  Order Again
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
