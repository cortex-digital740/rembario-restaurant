import { useState, useEffect } from 'react';
import { Star, Loader2, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateReview } from '@/hooks/useReviews';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export default function ReviewForm() {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const { user } = useAuth();
  const createReview = useCreateReview();
  const { toast } = useToast();

  // Load user's profile name
  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', user.id)
            .single();

          if (error) throw error;
          if (data?.full_name) {
            setName(data.full_name);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          setName('');
        } finally {
          setIsLoadingProfile(false);
        }
      };

      fetchProfile();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter your name before submitting.',
        variant: 'destructive',
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: 'Rating required',
        description: 'Please select a rating before submitting.',
        variant: 'destructive',
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: 'Review required',
        description: 'Please share your feedback before submitting.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Update user's profile with the name if it changed
      if (user && name) {
        await supabase
          .from('profiles')
          .update({ full_name: name })
          .eq('user_id', user.id);
      }

      // Submit the review
      await createReview.mutateAsync({ rating, comment });
      toast({
        title: 'Review submitted!',
        description: 'Thank you for your feedback. Your review is pending approval.',
      });
      setRating(0);
      setComment('');
    } catch (error: any) {
      toast({
        title: 'Failed to submit',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          Leave a Review
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Share your dining experience with us and other guests
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Your Name */}
          <div>
            <Label htmlFor="reviewer-name" className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4" />
              Your Name
            </Label>
            <Input
              id="reviewer-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              disabled={isLoadingProfile}
              required
              className="text-foreground"
            />
            <p className="text-xs text-muted-foreground mt-1">
              This name will be displayed with your review
            </p>
          </div>

          {/* Star Rating */}
          <div>
            <p className="text-sm font-medium mb-2">Your Rating</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <p className="text-sm font-medium mb-2">Your Feedback</p>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience..."
              rows={4}
            />
          </div>

          <Button type="submit" disabled={createReview.isPending}>
            {createReview.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Review'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
