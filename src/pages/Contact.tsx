import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { toast } from 'sonner';

const contactInfo = [
  { icon: MapPin, label: 'Address', value: '123 Gourmet Street, Foodie City, FC 12345' },
  { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
  { icon: Mail, label: 'Email', value: 'hello@rimberio.com' },
  { icon: Clock, label: 'Hours', value: 'Mon-Sun: 10am - 11pm' },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <PageTransition>
      <Header />
      <main className="pt-20 md:pt-24 min-h-screen">
        <section className="section-padding">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="card-elevated p-8">
                  <h2 className="font-heading text-2xl font-semibold mb-6">Contact Information</h2>
                  <div className="space-y-6">
                    {contactInfo.map((info, index) => (
                      <motion.div
                        key={info.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-start gap-4"
                      >
                        <div className="p-3 rounded-full bg-primary/10 text-primary">
                          <info.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{info.label}</p>
                          <p className="font-medium">{info.value}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Map Placeholder */}
                  <div className="mt-8 h-48 bg-secondary rounded-xl flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <MapPin className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">Map Preview</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <form onSubmit={handleSubmit} className="card-elevated p-8">
                  <h2 className="font-heading text-2xl font-semibold mb-6">Send a Message</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        className="w-full input-styled"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full input-styled"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Subject</label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="How can we help?"
                        className="w-full input-styled"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Message</label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Your message..."
                        className="w-full input-styled resize-none"
                      />
                    </div>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full btn-primary flex items-center justify-center gap-2 py-3 rounded-xl font-medium"
                    >
                      <Send className="w-4 h-4" />
                      Send Message
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
}
