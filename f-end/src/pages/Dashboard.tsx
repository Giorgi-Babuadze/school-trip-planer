import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToursManagement } from '@/components/dashboard/ToursManagement';
import { BookingsView } from '@/components/dashboard/BookingsView';
import TrainingDataManagement from '@/components/dashboard/TrainingDataManagement';
import TripRequestsAdmin from './TripRequestsAdmin';

export const Dashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage school trips, bookings, and trip requests
        </p>
      </div>

      <Tabs defaultValue="trips" className="w-full">
        <TabsList className="grid w-full max-w-4xl grid-cols-4">
          <TabsTrigger value="trips">Trip Requests</TabsTrigger>
          <TabsTrigger value="tours">Tours</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="training">Bot Training</TabsTrigger>
        </TabsList>

        <div className="mt-8">
          <TabsContent value="trips">
            <TripRequestsAdmin />
          </TabsContent>

          <TabsContent value="tours">
            <ToursManagement key={refreshKey} />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingsView />
          </TabsContent>

          <TabsContent value="training">
            <TrainingDataManagement />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};