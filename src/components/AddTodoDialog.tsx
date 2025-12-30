'use client';

import { useState, useEffect } from 'react';
import { Win95Window } from './Win95Window';
import { Win95Button } from './Win95Button';
import { Win95Input } from './Win95Input';
import { Win95FileInput } from './Win95FileInput';
import { Todo } from '@/lib/types';
import { storage } from '@/lib/storage';
import { compressImage, validateImageFile } from '@/lib/image-utils';
import { X } from 'lucide-react';

interface AddTodoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: string;
  onAdd: () => void;
}

export function AddTodoDialog({ open, onOpenChange, date, onAdd }: AddTodoDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(date);
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setTitle('');
      setDescription('');
      setSelectedDate(date);
      setImages([]);
      setError('');
    }
  }, [open, date]);

  const handleFileSelect = async (files: File[]) => {
    if (files.length === 0) return;

    setIsUploading(true);
    setError('');

    try {
      const compressedImages: string[] = [];

      for (const file of files) {
        const validation = validateImageFile(file);
        if (!validation.valid) {
          setError(validation.error || 'Invalid file');
          continue;
        }

        const compressed = await compressImage(file);
        compressedImages.push(compressed);
      }

      setImages((prev) => [...prev, ...compressedImages]);
    } catch (err) {
      setError('Failed to process images');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    const user = storage.getUser();
    if (!user) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      userId: user.id,
      title: title.trim(),
      description: description.trim() || undefined,
      date: selectedDate,
      completed: false,
      createdAt: new Date().toISOString(),
      images: images.length > 0 ? images : undefined,
    };

    try {
      storage.addTodo(newTodo);
      onAdd();
      onOpenChange(false);
    } catch (err) {
      setError('Failed to save task. Storage might be full.');
      console.error('Error saving todo:', err);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md">
        <Win95Window title="New Task" onClose={() => onOpenChange(false)}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="title" className="text-sm font-bold block">
                Title:
              </label>
              <Win95Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="description" className="text-sm font-bold block">
                Description:
              </label>
              <Win95Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="date" className="text-sm font-bold block">
                Date:
              </label>
              <Win95Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold block">Attach Images:</label>
              <div className="flex items-center gap-2">
                <Win95FileInput
                  onFileSelect={handleFileSelect}
                  disabled={isUploading}
                  multiple={true}
                />
                {isUploading && <span className="text-xs">Uploading...</span>}
              </div>
              {error && <p className="text-xs text-red-600">{error}</p>}
              {images.length > 0 && (
                <div className="win95-inset p-2 max-h-40 overflow-y-auto">
                  <div className="grid grid-cols-3 gap-2">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-20 object-cover border-2 border-gray-400"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute -top-1 -right-1 win95-button p-0.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Win95Button type="submit" variant="primary" disabled={isUploading}>
                OK
              </Win95Button>
              <Win95Button type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Win95Button>
            </div>
          </form>
        </Win95Window>
      </div>
    </div>
  );
}
