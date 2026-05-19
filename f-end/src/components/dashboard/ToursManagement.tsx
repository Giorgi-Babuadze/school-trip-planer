import { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus } from 'lucide-react';
import { getTours, deleteTour, Tour } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { TourForm } from './TourForm';

interface ToursManagementProps {
  onSuccess?: () => void;
}

export const ToursManagement: React.FC<ToursManagementProps> = ({
  onSuccess,
}) => {
  const { token } = useAuth();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const data = await getTours();
        setTours(data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        toast({
          title: 'Error',
          description: 'Failed to load tours',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [toast]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this tour?')) return;

    try {
      if (!token) return;
      await deleteTour(id, token);
      setTours(tours.filter(t => t._id !== id));
      toast({
        title: 'Success',
        description: 'Tour deleted successfully',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    setSelectedTour(null);
    // Refetch tours
    const fetchTours = async () => {
      try {
        const data = await getTours();
        setTours(data);
      } catch (err) {
        console.error('Failed to refetch tours', err);
      }
    };
    fetchTours();
    onSuccess?.();
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Tours Management</CardTitle>
          <Button
            onClick={() => {
              setSelectedTour(null);
              setFormOpen(true);
            }}
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Tour
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-md">
              {error}
            </div>
          )}
          {loading ? (
            <p className="text-center text-muted-foreground py-8">
              Loading tours...
            </p>
          ) : tours.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No tours found
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-right">Participants</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tours.map((tour) => (
                    <TableRow key={tour._id}>
                      <TableCell className="font-medium">{tour.title}</TableCell>
                      <TableCell>{tour.destination}</TableCell>
                      <TableCell>${tour.price}</TableCell>
                      <TableCell>{tour.duration} days</TableCell>
                      <TableCell className="text-right">
                        {tour.currentParticipants}/{tour.maxParticipants}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTour(tour);
                            setFormOpen(true);
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(tour._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <TourForm
        tour={selectedTour}
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setSelectedTour(null);
        }}
        onSuccess={handleFormSuccess}
      />
    </>
  );
};
