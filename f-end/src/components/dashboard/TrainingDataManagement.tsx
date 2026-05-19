import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  addTrainingData,
  getTrainingData,
  updateTrainingData,
  deleteTrainingData,
} from '@/services/api';

interface TrainingData {
  _id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

export default function TrainingDataManagement() {
  const { toast } = useToast();
  const [trainingData, setTrainingData] = useState<TrainingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
  });

  // Load training data on mount
  useEffect(() => {
    loadTrainingData();
  }, []);

  const loadTrainingData = async () => {
    try {
      setLoading(true);
      const response = await getTrainingData();
      if (response.success) {
        setTrainingData(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load training data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load training data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: 'Error',
        description: 'Title and content are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        const response = await updateTrainingData(editingId, formData);
        if (response.success) {
          toast({
            title: 'Success',
            description: 'Training data updated successfully',
          });
          loadTrainingData();
          resetForm();
        }
      } else {
        const response = await addTrainingData(formData);
        if (response.success) {
          toast({
            title: 'Success',
            description: 'Training data added successfully',
          });
          loadTrainingData();
          resetForm();
        }
      }
    } catch (error) {
      console.error('Error saving training data:', error);
      toast({
        title: 'Error',
        description: editingId
          ? 'Failed to update training data'
          : 'Failed to add training data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this training data?')) {
      return;
    }

    try {
      await deleteTrainingData(id);
      toast({
        title: 'Success',
        description: 'Training data deleted successfully',
      });
      loadTrainingData();
    } catch (error) {
      console.error('Error deleting training data:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete training data',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (data: TrainingData) => {
    setFormData({
      title: data.title,
      content: data.content,
      category: data.category,
    });
    setEditingId(data._id);
    setOpenDialog(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'general',
    });
    setEditingId(null);
    setOpenDialog(false);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bot Training Data</h2>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} className="bg-blue-500 hover:bg-blue-600">
              Add New Training Data
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Edit Training Data' : 'Add Training Data'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter title"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Input
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="Enter category"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Enter content"
                  rows={5}
                  disabled={loading}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading
                    ? 'Saving...'
                    : editingId
                      ? 'Update'
                      : 'Add'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Content Preview</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainingData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-gray-500">No training data yet</p>
                  </TableCell>
                </TableRow>
              ) : (
                trainingData.map((data) => (
                  <TableRow key={data._id}>
                    <TableCell className="font-medium">{data.title}</TableCell>
                    <TableCell>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {data.category}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {data.content}
                    </TableCell>
                    <TableCell>
                      {new Date(data.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(data)}
                          disabled={loading}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(data._id)}
                          disabled={loading}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
