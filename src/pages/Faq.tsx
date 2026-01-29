import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useFaqs } from '@/hooks/useFaqs';

export default function Faq() {
  const { data: faqs, isLoading } = useFaqs(true);

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
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
                Frequently Asked Questions
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Find answers to common questions about our restaurant
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-3xl mx-auto"
            >
              {isLoading ? (
                <div className="text-center py-12">Loading...</div>
              ) : faqs?.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No FAQs available yet.
                </div>
              ) : (
                <Accordion type="single" collapsible className="space-y-4">
                  {faqs?.map((faq, index) => (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <AccordionItem
                        value={faq.id}
                        className="border rounded-lg px-6 bg-card"
                      >
                        <AccordionTrigger className="text-left hover:no-underline py-4">
                          <span className="font-heading font-semibold text-lg">
                            {faq.question}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
              )}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
}
