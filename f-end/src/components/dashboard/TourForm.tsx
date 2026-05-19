import { useState } from 'react';
import { createTour, updateTour, Tour } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface TourFormProps {
  tour?: Tour | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const TourForm: React.FC<TourFormProps> = ({
  tour,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: tour?.title || '',
    description: tour?.description || '',
    destination: tour?.destination || '',
    price: tour?.price || 0,
    duration: tour?.duration || 1,
    maxParticipants: tour?.maxParticipants || 50,
    startDate: tour?.startDate?.split('T')[0] || '',
    endDate: tour?.endDate?.split('T')[0] || '',
    image: tour?.image || '',
    itinerary: tour?.itinerary?.join('\n') || '',
    includes: tour?.includes?.join('\n') || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!token) {
        toast({
          title: 'Error',
          description: 'Authentication token not found',
          variant: 'destructive',
        });
        return;
      }

      const payload = {
        ...formData,
        price: Number(formData.price),
        duration: Number(formData.duration),
        maxParticipants: Number(formData.maxParticipants),
        itinerary: formData.itinerary
          .split('\n')
          .filter(item => item.trim()),
        includes: formData.includes
          .split('\n')
          .filter(item => item.trim()),
      };

      if (tour?._id) {
        await updateTour(tour._id, payload, token);
        toast({
          title: 'Success',
          description: 'Tour updated successfully',
        });
      } else {
        await createTour(payload as any, token);
        toast({
          title: 'Success',
          description: 'Tour created successfully',
        });
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{tour ? 'Edit Tour' : 'Create New Tour'}</DialogTitle>
          <DialogDescription>
            {tour ? 'Update the tour information' : 'Add a new school trip'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) =>
                  setFormData({ ...formData, destination: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value as any })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value as any })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="maxParticipants">Max Participants</Label>
              <Input
                id="maxParticipants"
                type="number"
                value={formData.maxParticipants}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxParticipants: e.target.value as any,
                  })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="itinerary">Itinerary (one item per line)</Label>
            <Textarea
              id="itinerary"
              value={formData.itinerary}
              onChange={(e) =>
                setFormData({ ...formData, itinerary: e.target.value })
              }
              rows={3}
              placeholder="Day 1: Activity&#10;Day 2: Activity"
            />
          </div>

          <div>
            <Label htmlFor="includes">Includes (one item per line)</Label>
            <Textarea
              id="includes"
              value={formData.includes}
              onChange={(e) =>
                setFormData({ ...formData, includes: e.target.value })
              }
              rows={3}
              placeholder="Transportation&#10;Lunch&#10;Guide"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="mr-2">⏳</span>
                  {tour ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                tour ? 'Update Tour' : 'Create Tour'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
