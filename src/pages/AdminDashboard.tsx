import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Calendar, ShoppingBag, UtensilsCrossed, Star, 
  HelpCircle, LogOut, Plus, Edit, Trash2, Check, X, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { useDishes, useCreateDish, useUpdateDish, useDeleteDish } from '@/hooks/useDishes';
import { useTables, useCreateTable, useUpdateTable, useDeleteTable } from '@/hooks/useTables';
import { useReviews, useUpdateReviewStatus, useDeleteReview } from '@/hooks/useReviews';
import { useFaqs, useCreateFaq, useUpdateFaq, useDeleteFaq } from '@/hooks/useFaqs';
import { useOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import { useReservations } from '@/hooks/useReservations';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export default function AdminDashboard() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Data hooks
  const { data: dishes } = useDishes();
  const { data: tables } = useTables();
  const { data: reviews } = useReviews(false);
  const { data: faqs } = useFaqs(false);
  const { data: orders } = useOrders();
  const { data: reservations } = useReservations();

  // Users query
  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles (role)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Mutations
  const createDish = useCreateDish();
  const updateDish = useUpdateDish();
  const deleteDish = useDeleteDish();
  const createTable = useCreateTable();
  const updateTable = useUpdateTable();
  const deleteTable = useDeleteTable();
  const updateReviewStatus = useUpdateReviewStatus();
  const deleteReview = useDeleteReview();
  const createFaq = useCreateFaq();
  const updateFaq = useUpdateFaq();
  const deleteFaq = useDeleteFaq();
  const updateOrderStatus = useUpdateOrderStatus();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <PageTransition>
      <Header />
      <main className="pt-20 md:pt-24 min-h-screen">
        <section className="section-padding">
          <div className="container-custom">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground">Manage your restaurant</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <Users className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{users?.length || 0}</p>
                      <p className="text-sm text-muted-foreground">Users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <ShoppingBag className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{orders?.length || 0}</p>
                      <p className="text-sm text-muted-foreground">Orders</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <Calendar className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{reservations?.length || 0}</p>
                      <p className="text-sm text-muted-foreground">Reservations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <Star className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{reviews?.filter(r => r.status === 'pending').length || 0}</p>
                      <p className="text-sm text-muted-foreground">Pending Reviews</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="orders" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="reservations">Reservations</TabsTrigger>
                <TabsTrigger value="dishes">Dishes</TabsTrigger>
                <TabsTrigger value="tables">Tables</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="faqs">FAQs</TabsTrigger>
              </TabsList>

              {/* Orders Tab */}
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>All Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orders?.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge>{order.status}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {new Date(order.created_at).toLocaleString()}
                              </span>
                            </div>
                            <p className="font-medium">${Number(order.total_amount).toFixed(2)}</p>
                          </div>
                          <div className="flex gap-2">
                            {order.status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => updateOrderStatus.mutate({
                                  id: order.id,
                                  status: 'preparing',
                                  orderStartedAt: new Date().toISOString(),
                                })}
                              >
                                Start Preparing
                              </Button>
                            )}
                            {order.status === 'preparing' && (
                              <Button
                                size="sm"
                                onClick={() => updateOrderStatus.mutate({
                                  id: order.id,
                                  status: 'ready',
                                })}
                              >
                                Mark Ready
                              </Button>
                            )}
                            {order.status === 'ready' && (
                              <Button
                                size="sm"
                                onClick={() => updateOrderStatus.mutate({
                                  id: order.id,
                                  status: 'completed',
                                })}
                              >
                                Complete
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reservations Tab */}
              <TabsContent value="reservations">
                <Card>
                  <CardHeader>
                    <CardTitle>All Reservations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reservations?.map((res: any) => (
                        <div key={res.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge>{res.status}</Badge>
                              <span className="text-sm font-medium">Table {res.restaurant_tables?.table_number}</span>
                            </div>
                            <p>{res.guest_name} - {res.guest_phone}</p>
                            <p className="text-sm text-muted-foreground">
                              {res.reservation_date} at {res.reservation_time} • Party of {res.party_size}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Dishes Tab */}
              <TabsContent value="dishes">
                <DishesManager
                  dishes={dishes || []}
                  createDish={createDish}
                  updateDish={updateDish}
                  deleteDish={deleteDish}
                  toast={toast}
                />
              </TabsContent>

              {/* Tables Tab */}
              <TabsContent value="tables">
                <TablesManager
                  tables={tables || []}
                  createTable={createTable}
                  updateTable={updateTable}
                  deleteTable={deleteTable}
                  toast={toast}
                />
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reviews?.map((review: any) => (
                        <div key={review.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={
                                review.status === 'approved' ? 'default' :
                                review.status === 'rejected' ? 'destructive' : 'secondary'
                              }>
                                {review.status}
                              </Badge>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm">{review.comment}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {review.profiles?.full_name} • {new Date(review.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {review.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="text-green-600"
                                onClick={() => updateReviewStatus.mutate({ id: review.id, status: 'approved' })}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                className="text-red-600"
                                onClick={() => updateReviewStatus.mutate({ id: review.id, status: 'rejected' })}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* FAQs Tab */}
              <TabsContent value="faqs">
                <FaqsManager
                  faqs={faqs || []}
                  createFaq={createFaq}
                  updateFaq={updateFaq}
                  deleteFaq={deleteFaq}
                  toast={toast}
                />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
}

// Dishes Manager Component
function DishesManager({ dishes, createDish, updateDish, deleteDish, toast }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'main',
    preparation_time: '15',
    image_url: '',
    is_veg: false,
    is_available: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        preparation_time: parseInt(formData.preparation_time),
      };

      if (editingDish) {
        await updateDish.mutateAsync({ id: editingDish.id, updates: data });
        toast({ title: 'Dish updated!' });
      } else {
        await createDish.mutateAsync(data);
        toast({ title: 'Dish created!' });
      }
      setIsOpen(false);
      resetForm();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setEditingDish(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'main',
      preparation_time: '15',
      image_url: '',
      is_veg: false,
      is_available: true,
    });
  };

  const openEdit = (dish: any) => {
    setEditingDish(dish);
    setFormData({
      name: dish.name,
      description: dish.description || '',
      price: dish.price.toString(),
      category: dish.category,
      preparation_time: dish.preparation_time.toString(),
      image_url: dish.image_url || '',
      is_veg: dish.is_veg,
      is_available: dish.is_available,
    });
    setIsOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manage Dishes</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Dish
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingDish ? 'Edit Dish' : 'Add New Dish'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Prep Time (min)</Label>
                  <Input
                    type="number"
                    value={formData.preparation_time}
                    onChange={e => setFormData({ ...formData, preparation_time: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <select
                  className="w-full border rounded-md p-2 bg-background"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="starters">Starters</option>
                  <option value="main">Main Course</option>
                  <option value="drinks">Drinks</option>
                  <option value="desserts">Desserts</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  value={formData.image_url}
                  onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_veg}
                    onCheckedChange={checked => setFormData({ ...formData, is_veg: checked })}
                  />
                  <Label>Vegetarian</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_available}
                    onCheckedChange={checked => setFormData({ ...formData, is_available: checked })}
                  />
                  <Label>Available</Label>
                </div>
              </div>
              <Button type="submit" className="w-full">
                {editingDish ? 'Update Dish' : 'Create Dish'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dishes.map((dish: any) => (
            <div key={dish.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <img
                  src={dish.image_url || 'https://via.placeholder.com/60'}
                  alt={dish.name}
                  className="w-16 h-16 rounded object-cover"
                />
                <div>
                  <p className="font-medium">{dish.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ${Number(dish.price).toFixed(2)} • {dish.preparation_time} min • {dish.category}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="outline" onClick={() => openEdit(dish)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="text-red-600"
                  onClick={() => deleteDish.mutate(dish.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Tables Manager Component
function TablesManager({ tables, createTable, updateTable, deleteTable, toast }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ table_number: '', total_seats: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTable.mutateAsync({
        table_number: parseInt(formData.table_number),
        total_seats: parseInt(formData.total_seats),
      });
      toast({ title: 'Table created!' });
      setIsOpen(false);
      setFormData({ table_number: '', total_seats: '' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manage Tables</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Table
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Table</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Table Number</Label>
                <Input
                  type="number"
                  value={formData.table_number}
                  onChange={e => setFormData({ ...formData, table_number: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Total Seats</Label>
                <Input
                  type="number"
                  value={formData.total_seats}
                  onChange={e => setFormData({ ...formData, total_seats: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Create Table</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tables.map((table: any) => (
            <div key={table.id} className="p-4 border rounded-lg text-center">
              <p className="font-heading text-xl font-bold mb-1">Table {table.table_number}</p>
              <p className="text-sm text-muted-foreground">{table.total_seats} seats</p>
              <Button
                size="sm"
                variant="outline"
                className="mt-2 text-red-600"
                onClick={() => deleteTable.mutate(table.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// FAQs Manager Component
function FaqsManager({ faqs, createFaq, updateFaq, deleteFaq, toast }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any>(null);
  const [formData, setFormData] = useState({ question: '', answer: '', display_order: '0' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        display_order: parseInt(formData.display_order),
      };

      if (editingFaq) {
        await updateFaq.mutateAsync({ id: editingFaq.id, updates: data });
        toast({ title: 'FAQ updated!' });
      } else {
        await createFaq.mutateAsync(data);
        toast({ title: 'FAQ created!' });
      }
      setIsOpen(false);
      setFormData({ question: '', answer: '', display_order: '0' });
      setEditingFaq(null);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const openEdit = (faq: any) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      display_order: faq.display_order.toString(),
    });
    setIsOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manage FAQs</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingFaq(null); setFormData({ question: '', answer: '', display_order: '0' }); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add FAQ
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingFaq ? 'Edit FAQ' : 'Add New FAQ'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Question</Label>
                <Input
                  value={formData.question}
                  onChange={e => setFormData({ ...formData, question: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Answer</Label>
                <Textarea
                  value={formData.answer}
                  onChange={e => setFormData({ ...formData, answer: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={formData.display_order}
                  onChange={e => setFormData({ ...formData, display_order: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingFaq ? 'Update FAQ' : 'Create FAQ'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {faqs.map((faq: any) => (
            <div key={faq.id} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{faq.question}</p>
                  <p className="text-sm text-muted-foreground mt-1">{faq.answer}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline" onClick={() => openEdit(faq)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="text-red-600"
                    onClick={() => deleteFaq.mutate(faq.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
