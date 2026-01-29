-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create order_status enum
CREATE TYPE public.order_status AS ENUM ('pending', 'preparing', 'ready', 'completed', 'cancelled');

-- Create reservation_status enum
CREATE TYPE public.reservation_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Create review_status enum
CREATE TYPE public.review_status AS ENUM ('pending', 'approved', 'rejected');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Create restaurant_tables table
CREATE TABLE public.restaurant_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number INTEGER NOT NULL UNIQUE,
  total_seats INTEGER NOT NULL CHECK (total_seats > 0),
  is_available BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create dishes table
CREATE TABLE public.dishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  category TEXT NOT NULL,
  preparation_time INTEGER NOT NULL DEFAULT 15, -- in minutes
  is_veg BOOLEAN DEFAULT false NOT NULL,
  is_available BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create reservations table
CREATE TABLE public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  table_id UUID REFERENCES public.restaurant_tables(id) ON DELETE CASCADE NOT NULL,
  guest_name TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  party_size INTEGER NOT NULL CHECK (party_size > 0),
  status reservation_status DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reservation_id UUID REFERENCES public.reservations(id) ON DELETE SET NULL,
  status order_status DEFAULT 'pending' NOT NULL,
  total_amount DECIMAL(10, 2) DEFAULT 0 NOT NULL,
  total_preparation_time INTEGER DEFAULT 0 NOT NULL, -- max preparation time in minutes
  order_started_at TIMESTAMP WITH TIME ZONE, -- when order started preparing
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  dish_id UUID REFERENCES public.dishes(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  status review_status DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create faqs table
CREATE TABLE public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check if user has a role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- Create trigger function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create updated_at triggers for all tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_restaurant_tables_updated_at
  BEFORE UPDATE ON public.restaurant_tables
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dishes_updated_at
  BEFORE UPDATE ON public.dishes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

-- RLS Policies for restaurant_tables
CREATE POLICY "Anyone can view tables" ON public.restaurant_tables
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert tables" ON public.restaurant_tables
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update tables" ON public.restaurant_tables
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Only admins can delete tables" ON public.restaurant_tables
  FOR DELETE USING (public.is_admin());

-- RLS Policies for dishes
CREATE POLICY "Anyone can view available dishes" ON public.dishes
  FOR SELECT USING (is_available = true OR public.is_admin());

CREATE POLICY "Only admins can insert dishes" ON public.dishes
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update dishes" ON public.dishes
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Only admins can delete dishes" ON public.dishes
  FOR DELETE USING (public.is_admin());

-- RLS Policies for reservations
CREATE POLICY "Users can view own reservations, admins all" ON public.reservations
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Authenticated users can create reservations" ON public.reservations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending reservations" ON public.reservations
  FOR UPDATE USING (
    (auth.uid() = user_id AND status IN ('pending', 'confirmed')) 
    OR public.is_admin()
  );

CREATE POLICY "Users can delete own pending reservations" ON public.reservations
  FOR DELETE USING (
    (auth.uid() = user_id AND status = 'pending') 
    OR public.is_admin()
  );

-- RLS Policies for orders
CREATE POLICY "Users can view own orders, admins all" ON public.orders
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Authenticated users can create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending orders" ON public.orders
  FOR UPDATE USING (
    (auth.uid() = user_id AND status NOT IN ('completed', 'cancelled'))
    OR public.is_admin()
  );

CREATE POLICY "Users can delete own pending orders" ON public.orders
  FOR DELETE USING (
    (auth.uid() = user_id AND status = 'pending')
    OR public.is_admin()
  );

-- RLS Policies for order_items
CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Users can insert items to own orders" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
      AND orders.status NOT IN ('completed', 'cancelled')
    )
  );

CREATE POLICY "Users can delete items from own pending orders" ON public.order_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
      AND orders.status = 'pending'
    ) OR public.is_admin()
  );

-- RLS Policies for reviews
CREATE POLICY "Anyone can view approved reviews" ON public.reviews
  FOR SELECT USING (status = 'approved' OR auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Authenticated users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending reviews" ON public.reviews
  FOR UPDATE USING (
    (auth.uid() = user_id AND status = 'pending')
    OR public.is_admin()
  );

CREATE POLICY "Users can delete own reviews" ON public.reviews
  FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

-- RLS Policies for faqs
CREATE POLICY "Anyone can view active faqs" ON public.faqs
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Only admins can insert faqs" ON public.faqs
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update faqs" ON public.faqs
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Only admins can delete faqs" ON public.faqs
  FOR DELETE USING (public.is_admin());

-- Enable realtime for orders (for countdown)
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reservations;

-- Insert sample data for tables
INSERT INTO public.restaurant_tables (table_number, total_seats) VALUES
  (1, 2), (2, 2), (3, 4), (4, 4), (5, 6), (6, 6), (7, 8), (8, 10);

-- Insert sample dishes
INSERT INTO public.dishes (name, description, price, category, preparation_time, is_veg, image_url) VALUES
  ('Crispy Bruschetta', 'Toasted bread topped with fresh tomatoes, basil, and olive oil', 8.99, 'starters', 10, true, 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop'),
  ('Garlic Prawns', 'Succulent prawns sautéed in garlic butter and herbs', 14.99, 'starters', 15, false, 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=400&h=300&fit=crop'),
  ('Grilled Salmon', 'Atlantic salmon with lemon herb butter and seasonal vegetables', 26.99, 'main', 25, false, 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop'),
  ('Mushroom Risotto', 'Creamy arborio rice with wild mushrooms and parmesan', 18.99, 'main', 22, true, 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop'),
  ('Beef Tenderloin', 'Prime cut steak with red wine reduction and mashed potatoes', 34.99, 'main', 30, false, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop'),
  ('Fresh Lemonade', 'House-made lemonade with mint and honey', 4.99, 'drinks', 5, true, 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop'),
  ('Tiramisu', 'Classic Italian dessert with mascarpone and espresso', 9.99, 'desserts', 10, true, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop'),
  ('Chocolate Fondant', 'Warm chocolate cake with molten center and vanilla ice cream', 11.99, 'desserts', 15, true, 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop');

-- Insert sample FAQs
INSERT INTO public.faqs (question, answer, display_order) VALUES
  ('What are your opening hours?', 'We are open Monday to Sunday, 11:00 AM to 11:00 PM.', 1),
  ('Do you accept reservations?', 'Yes! You can make a reservation through our website or by calling us directly.', 2),
  ('Is there parking available?', 'Yes, we have complimentary valet parking for all our guests.', 3),
  ('Do you cater for dietary requirements?', 'Absolutely! We offer vegetarian, vegan, and gluten-free options. Please inform our staff of any allergies.', 4),
  ('Can I host a private event?', 'Yes, we have a private dining room that can accommodate up to 30 guests. Contact us for more details.', 5);