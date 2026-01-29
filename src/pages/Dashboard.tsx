import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, ShoppingBag, History, Star, LogOut, Calendar, ChefHat } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useDishes } from '@/hooks/useDishes';
import { useOrders, useCreateOrder, useCancelOrder } from '@/hooks/useOrders';
import { useReservations, useCancelReservation } from '@/hooks/useReservations';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import OrderCountdown from '@/components/OrderCountdown';
import ReviewForm from '@/components/ReviewForm';

export default function Dashboard() {
  const { user, signOut, isAdmin } = useAuth();
  const { data: dishes } = useDishes();
  const { data: orders } = useOrders();
  const { data: reservations } = useReservations();
  const { items, addItem, updateQuantity, clearCart, totalAmount } = useCart();
  const createOrder = useCreateOrder();
  const cancelOrder = useCancelOrder();
  const cancelReservation = useCancelReservation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Add items to your cart before placing an order.',
        variant: 'destructive',
      });
      return;
    }

    const maxPrepTime = Math.max(...items.map(item => {
      const prepTime = item.preparationTime;
      return typeof prepTime === 'number' ? prepTime : 15;
    }));

    try {
      await createOrder.mutateAsync({
        items: items.map(item => ({
          dishId: item.id,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
        totalAmount: totalAmount,
        maxPrepTime,
      });

      clearCart();
      toast({
        title: 'Order placed!',
        description: 'Your order has been submitted successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Order failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrder.mutateAsync(orderId);
      toast({
        title: 'Order cancelled',
        description: 'Your order has been cancelled.',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to cancel',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    try {
      await cancelReservation.mutateAsync(reservationId);
      toast({
        title: 'Reservation cancelled',
        description: 'Your reservation has been cancelled.',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to cancel',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const activeOrders = orders?.filter(o => ['pending', 'preparing', 'ready'].includes(o.status)) || [];
  const orderHistory = orders?.filter(o => ['completed', 'cancelled'].includes(o.status)) || [];
  const activeReservations = reservations?.filter(r => ['pending', 'confirmed'].includes(r.status)) || [];

  return (
    <PageTransition>
      <Header />
      <main className="pt-20 md:pt-24 min-h-screen">
        <section className="section-padding">
          <div className="container-custom">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">
                  Welcome back!
                </h1>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
              <div className="flex gap-4">
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline">Admin Dashboard</Button>
                  </Link>
                )}
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>

            <Tabs defaultValue="menu" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="menu">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Menu
                </TabsTrigger>
                <TabsTrigger value="orders">
                  <Clock className="w-4 h-4 mr-2" />
                  Active Orders
                </TabsTrigger>
                <TabsTrigger value="history">
                  <History className="w-4 h-4 mr-2" />
                  History
                </TabsTrigger>
                <TabsTrigger value="reservations">
                  <Calendar className="w-4 h-4 mr-2" />
                  Reservations
                </TabsTrigger>
                <TabsTrigger value="review">
                  <Star className="w-4 h-4 mr-2" />
                  Review
                </TabsTrigger>
              </TabsList>

              {/* Menu Tab */}
              <TabsContent value="menu">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Dishes */}
                  <div className="lg:col-span-2">
                    <div className="grid sm:grid-cols-2 gap-4">
                      {dishes?.map((dish) => (
                        <motion.div
                          key={dish.id}
                          whileHover={{ y: -4 }}
                          className="bg-card border border-border rounded-lg overflow-hidden"
                        >
                          <img
                            src={dish.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=200&fit=crop'}
                            alt={dish.name}
                            className="w-full h-40 object-cover"
                          />
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-heading font-semibold">{dish.name}</h3>
                              <span className="text-primary font-bold">
                                ${Number(dish.price).toFixed(2)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {dish.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <ChefHat className="w-4 h-4 mr-1" />
                                {dish.preparation_time} min
                              </div>
                              <Button
                                size="sm"
                                onClick={() => addItem({
                                  id: dish.id,
                                  name: dish.name,
                                  price: Number(dish.price),
                                  image: dish.image_url || '',
                                  preparationTime: dish.preparation_time,
                                })}
                              >
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Cart */}
                  <div>
                    <Card className="sticky top-24">
                      <CardHeader>
                        <CardTitle>Your Cart</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {items.length === 0 ? (
                          <p className="text-muted-foreground text-center py-8">
                            Your cart is empty
                          </p>
                        ) : (
                          <>
                            <div className="space-y-4 mb-6">
                              {items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      ${item.price.toFixed(2)} x {item.quantity}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      className="h-8 w-8"
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    >
                                      -
                                    </Button>
                                    <span className="w-8 text-center">{item.quantity}</span>
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      className="h-8 w-8"
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                      +
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="border-t pt-4 mb-4">
                              <div className="flex justify-between font-semibold text-lg">
                                <span>Total</span>
                                <span>${totalAmount.toFixed(2)}</span>
                              </div>
                            </div>
                            <Button
                              className="w-full"
                              onClick={handlePlaceOrder}
                              disabled={createOrder.isPending}
                            >
                              {createOrder.isPending ? 'Placing Order...' : 'Place Order'}
                            </Button>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Active Orders Tab */}
              <TabsContent value="orders">
                {activeOrders.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No active orders</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {activeOrders.map((order) => (
                      <Card key={order.id}>
                        <CardContent className="py-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <Badge variant={
                                  order.status === 'preparing' ? 'default' :
                                  order.status === 'ready' ? 'secondary' : 'outline'
                                }>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(order.created_at).toLocaleString()}
                                </span>
                              </div>
                              <div className="text-sm text-muted-foreground mb-2">
                                {order.order_items?.map((item: any) => (
                                  <span key={item.id} className="mr-2">
                                    {item.quantity}x {item.dishes?.name}
                                  </span>
                                ))}
                              </div>
                              <p className="font-semibold">
                                Total: ${Number(order.total_amount).toFixed(2)}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              {order.status === 'preparing' && order.order_started_at && (
                                <OrderCountdown
                                  startTime={order.order_started_at}
                                  prepTime={order.total_preparation_time}
                                />
                              )}
                              {order.status === 'pending' && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleCancelOrder(order.id)}
                                >
                                  Cancel Order
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Order History Tab */}
              <TabsContent value="history">
                {orderHistory.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <History className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No order history</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {orderHistory.map((order) => (
                      <Card key={order.id}>
                        <CardContent className="py-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <Badge variant={
                                  order.status === 'completed' ? 'default' : 'destructive'
                                }>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(order.created_at).toLocaleString()}
                                </span>
                              </div>
                              <div className="text-sm text-muted-foreground mb-2">
                                {order.order_items?.map((item: any) => (
                                  <span key={item.id} className="mr-2">
                                    {item.quantity}x {item.dishes?.name}
                                  </span>
                                ))}
                              </div>
                              <p className="font-semibold">
                                Total: ${Number(order.total_amount).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Reservations Tab */}
              <TabsContent value="reservations">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-heading text-xl font-semibold">My Reservations</h2>
                  <Link to="/reservations">
                    <Button>New Reservation</Button>
                  </Link>
                </div>
                {activeReservations.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No active reservations</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {activeReservations.map((reservation: any) => (
                      <Card key={reservation.id}>
                        <CardContent className="py-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <Badge variant="outline">
                                  Table {reservation.restaurant_tables?.table_number}
                                </Badge>
                                <Badge variant={
                                  reservation.status === 'confirmed' ? 'default' : 'secondary'
                                }>
                                  {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="font-medium">
                                {reservation.reservation_date} at {reservation.reservation_time}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Party of {reservation.party_size} • {reservation.guest_name}
                              </p>
                            </div>
                            {reservation.status === 'pending' && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleCancelReservation(reservation.id)}
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Review Tab */}
              <TabsContent value="review">
                <ReviewForm />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
}
