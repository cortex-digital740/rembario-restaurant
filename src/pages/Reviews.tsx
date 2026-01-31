import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { Card, CardContent } from '@/components/ui/card';
import { useReviews } from '@/hooks/useReviews';
import ReviewForm from '@/components/ReviewForm';
import { useAuth } from '@/context/AuthContext';

export default function Reviews() {
  const { data: reviews, isLoading } = useReviews(true);
  const { user } = useAuth();

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
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Customer Reviews</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                See what our valued customers have to say about their dining experience
              </p>
            </motion.div>

            {/* Submit Review */}
            {user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="max-w-xl mx-auto mb-12"
              >
                <ReviewForm />
              </motion.div>
            )}

            {/* Reviews Grid */}
            {isLoading ? (
              <div className="text-center py-12">Loading reviews...</div>
            ) : reviews?.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No reviews yet. Be the first to leave one!
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews?.map((review: any, index: number) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="pt-6 flex flex-col h-full">
                        {/* Reviewer Info Section */}
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                          {/* Avatar/Photo */}
                          <div className="flex-shrink-0">
                            {review.profiles?.avatar_url ? (
                              <img
                                src={review.profiles.avatar_url}
                                alt={review.profiles?.full_name || 'Reviewer'}
                                className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center border-2 border-primary/20">
                                <span className="text-white font-bold text-lg">
                                  {review.profiles?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Reviewer Details */}
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground text-lg">
                              {review.profiles?.full_name || 'Anonymous Reviewer'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(review.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex gap-1 mb-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-muted'
                              }`}
                            />
                          ))}
                        </div>

                        {/* Comment */}
                        <p className="text-foreground leading-relaxed flex-grow">
                          "{review.comment}"
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
}
