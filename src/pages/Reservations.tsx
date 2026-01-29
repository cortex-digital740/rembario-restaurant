import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Phone, User, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTableAvailability, useCreateReservation } from '@/hooks/useReservations';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, Link } from 'react-router-dom';

export default function Reservations() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    guestName: '',
    guestPhone: '',
    date: today,
    time: '19:00',
    partySize: 2,
    selectedTableId: '',
  });

  const { data: tables, isLoading: tablesLoading } = useTableAvailability(formData.date, formData.time);
  const createReservation = useCreateReservation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'partySize' ? parseInt(value) || 1 : value,
    }));
  };

  const handleTableSelect = (tableId: string) => {
    setFormData(prev => ({ ...prev, selectedTableId: tableId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to make a reservation.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    const selectedTable = tables?.find(t => t.id === formData.selectedTableId);
    if (!selectedTable) {
      toast({
        title: 'Select a table',
        description: 'Please select a table for your reservation.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.partySize > selectedTable.available_seats) {
      toast({
        title: 'Not enough seats',
        description: `This table only has ${selectedTable.available_seats} available seats.`,
        variant: 'destructive',
      });
      return;
    }

    try {
      await createReservation.mutateAsync({
        user_id: user.id,
        table_id: formData.selectedTableId,
        guest_name: formData.guestName,
        guest_phone: formData.guestPhone,
        reservation_date: formData.date,
        reservation_time: formData.time,
        party_size: formData.partySize,
      });

      toast({
        title: 'Reservation confirmed!',
        description: `Your table is reserved for ${formData.date} at ${formData.time}.`,
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Reservation failed',
        description: error.message,
        variant: 'destructive',
      });
    }
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
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Reserve Your Table</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Select your preferred date and time, then choose from available tables
              </p>
            </motion.div>

            {!user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto mb-8 p-4 bg-accent/50 rounded-lg text-center"
              >
                <p className="text-muted-foreground mb-2">Please log in to make a reservation</p>
                <Link to="/login">
                  <Button>Login</Button>
                </Link>
              </motion.div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Reservation Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Reservation Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="guestName">
                            <User className="w-4 h-4 inline mr-2" />
                            Name
                          </Label>
                          <Input
                            id="guestName"
                            name="guestName"
                            value={formData.guestName}
                            onChange={handleInputChange}
                            placeholder="Your name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guestPhone">
                            <Phone className="w-4 h-4 inline mr-2" />
                            Phone
                          </Label>
                          <Input
                            id="guestPhone"
                            name="guestPhone"
                            value={formData.guestPhone}
                            onChange={handleInputChange}
                            placeholder="Your phone"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="date">
                            <Calendar className="w-4 h-4 inline mr-2" />
                            Date
                          </Label>
                          <Input
                            id="date"
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            min={today}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="time">
                            <Clock className="w-4 h-4 inline mr-2" />
                            Time
                          </Label>
                          <Input
                            id="time"
                            name="time"
                            type="time"
                            value={formData.time}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="partySize">
                          <Users className="w-4 h-4 inline mr-2" />
                          Party Size
                        </Label>
                        <Input
                          id="partySize"
                          name="partySize"
                          type="number"
                          min="1"
                          max="20"
                          value={formData.partySize}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={!formData.selectedTableId || createReservation.isPending || !user}
                      >
                        {createReservation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Reserving...
                          </>
                        ) : (
                          'Confirm Reservation'
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Available Tables */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Available Tables</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {tablesLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        {tables?.map((table) => {
                          const isSelected = formData.selectedTableId === table.id;
                          const canAccommodate = table.available_seats >= formData.partySize;
                          const isAvailable = table.available_seats > 0;
                          
                          return (
                            <motion.div
                              key={table.id}
                              whileHover={{ scale: canAccommodate && isAvailable ? 1.02 : 1 }}
                              whileTap={{ scale: canAccommodate && isAvailable ? 0.98 : 1 }}
                              onClick={() => canAccommodate && isAvailable && handleTableSelect(table.id)}
                              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                                isSelected
                                  ? 'border-primary bg-primary/10'
                                  : canAccommodate && isAvailable
                                  ? 'border-border hover:border-primary/50'
                                  : 'border-border bg-muted/50 cursor-not-allowed opacity-50'
                              }`}
                            >
                              <div className="text-center">
                                <div className="font-heading text-2xl font-bold mb-2">
                                  Table {table.table_number}
                                </div>
                                <div className="text-sm text-muted-foreground space-y-1">
                                  <p>Total Seats: {table.total_seats}</p>
                                  <p className="text-yellow-600">Booked: {table.booked_seats}</p>
                                  <p className={table.available_seats > 0 ? 'text-green-600' : 'text-red-600'}>
                                    Available: {table.available_seats}
                                  </p>
                                </div>
                                {!canAccommodate && isAvailable && (
                                  <p className="text-xs text-red-500 mt-2">
                                    Not enough seats for your party
                                  </p>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
}
