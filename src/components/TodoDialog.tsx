'use client';

import { useState, useEffect } from 'react';
import { Win95Window } from './Win95Window';
import { Win95Button } from './Win95Button';
import { Win95Input } from './Win95Input';
import { Win95FileInput } from './Win95FileInput';
import { Win95ConfirmDialog } from './Win95ConfirmDialog';
import { ImageViewer } from './ImageViewer';
import { ImageGalleryViewer } from './ImageGalleryViewer';
import { Todo } from '@/lib/types';
import { storage } from '@/lib/storage';
import { cn } from '@/lib/utils';
import { compressImage, validateImageFile } from '@/lib/image-utils';
import { X, ZoomIn } from 'lucide-react';

interface TodoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  todo: Todo | null;
  onUpdate: () => void;
}

export function TodoDialog({ open, onOpenChange, todo, onUpdate }: TodoDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  // Load todo data when dialog opens or todo changes
  useEffect(() => {
    if (open && todo) {
      // Fetch fresh data from localStorage to ensure we have the latest
      const todos = storage.getTodos();
      const freshTodo = todos.find(t => t.id === todo.id);
      const todoData = freshTodo || todo;

      setTitle(todoData.title);
      setDescription(todoData.description || '');
      setSelectedDate(todoData.date);
      setImages(todoData.images || []);
      setIsEditing(false);
      setError('');
    }
  }, [open, todo]);

  const handleOpen = (isOpen: boolean) => {
    onOpenChange(isOpen);
  };

  const handleToggleComplete = () => {
    setShowCompleteConfirm(true);
  };

  const confirmToggleComplete = () => {
    if (todo) {
      storage.updateTodo(todo.id, { completed: !todo.completed });
      onUpdate();
      setShowCompleteConfirm(false);
    }
  };

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

  const handleSave = () => {
    if (todo && isEditing) {
      try {
        storage.updateTodo(todo.id, {
          title: title.trim(),
          description: description.trim(),
          date: selectedDate,
          images: images.length > 0 ? images : undefined,
        });
        setIsEditing(false);
        onUpdate();
      } catch (err) {
        setError('Failed to save changes. Storage might be full.');
        console.error('Error updating todo:', err);
      }
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (todo) {
      storage.deleteTodo(todo.id);
      onUpdate();
      setShowDeleteConfirm(false);
      onOpenChange(false);
    }
  };

  if (!todo || !open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-md">
          <Win95Window
            title={isEditing ? 'Edit Task' : 'Task Details'}
            onClose={() => handleOpen(false)}
          >
            <div className="space-y-3">
              {isEditing ? (
                <>
                  <div className="space-y-1">
                    <label htmlFor="edit-title" className="text-sm font-bold block">
                      Title:
                    </label>
                    <Win95Input
                      id="edit-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="edit-description" className="text-sm font-bold block">
                      Description:
                    </label>
                    <Win95Input
                      id="edit-description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="edit-date" className="text-sm font-bold block">
                      Date:
                    </label>
                    <Win95Input
                      id="edit-date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-bold block">Images:</label>
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
                                className="w-full h-20 object-cover border-2 border-gray-400 cursor-pointer bg-gray-200"
                                onClick={() => {
                                  setSelectedImageIndex(idx);
                                  setShowImageViewer(true);
                                }}
                                onError={(e) => {
                                  console.error('Failed to load image:', idx, img?.substring(0, 50));
                                  e.currentTarget.style.backgroundColor = '#ff0000';
                                }}
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
                </>
              ) : (
                <>
                  <div>
                    <p className="text-xs font-bold">Title:</p>
                    <p
                      className={cn(
                        'text-sm',
                        todo.completed && 'line-through text-gray-600'
                      )}
                    >
                      {todo.title}
                    </p>
                  </div>
                  {todo.description && (
                    <div>
                      <p className="text-xs font-bold">Description:</p>
                      <p className="text-sm">{todo.description}</p>
                    </div>
                  )}
                  {todo.images && todo.images.length > 0 && (
                    <div>
                      <p className="text-xs font-bold">Images ({todo.images.length}):</p>
                      <div className="win95-inset p-2 max-h-40 overflow-y-auto">
                        <div className="grid grid-cols-3 gap-2">
                          {todo.images.map((img, idx) => (
                            <div key={idx} className="relative group cursor-pointer">
                              <img
                                src={img}
                                alt={`Attachment ${idx + 1}`}
                                className="w-full h-20 object-cover border-2 border-gray-400 bg-gray-200"
                                onClick={() => {
                                  setSelectedImageIndex(idx);
                                  setShowImageViewer(true);
                                }}
                                onError={(e) => {
                                  console.error('Failed to load image in detail view:', idx, img?.substring(0, 50));
                                  e.currentTarget.style.backgroundColor = '#ff0000';
                                }}
                              />
                              <div className="absolute inset-0 bg-transparent group-hover:bg-black group-hover:bg-opacity-30 transition-all flex items-center justify-center pointer-events-none">
                                <ZoomIn className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold">Date:</p>
                    <p className="text-sm">{new Date(todo.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold">Status:</p>
                    <p className="text-sm">
                      {todo.completed ? 'Completed' : 'Pending'}
                    </p>
                  </div>
                </>
              )}

              <div className="flex gap-2 justify-end pt-2 flex-wrap">
                {isEditing ? (
                  <>
                    <Win95Button onClick={() => setIsEditing(false)}>
                      Cancel
                    </Win95Button>
                    <Win95Button onClick={handleSave} variant="primary">
                      Save
                    </Win95Button>
                  </>
                ) : (
                  <>
                    <Win95Button onClick={handleDelete}>Delete</Win95Button>
                    <Win95Button onClick={handleToggleComplete}>
                      {todo.completed ? 'Incomplete' : 'Complete'}
                    </Win95Button>
                    <Win95Button onClick={() => setIsEditing(true)} variant="primary">
                      Edit
                    </Win95Button>
                  </>
                )}
              </div>
            </div>
          </Win95Window>
        </div>
      </div>

      <Win95ConfirmDialog
        open={showDeleteConfirm}
        title="Delete Task"
        message="Are you sure you want to delete this task?"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <Win95ConfirmDialog
        open={showCompleteConfirm}
        title={todo?.completed ? "Mark as Incomplete" : "Complete Task"}
        message={
          todo?.completed
            ? "Are you sure you want to mark this task as incomplete?"
            : "Are you sure you want to complete this task?"
        }
        onConfirm={confirmToggleComplete}
        onCancel={() => setShowCompleteConfirm(false)}
      />

      {todo?.images && todo.images.length > 0 && (
        <>
          {todo.images.length === 1 ? (
            <ImageViewer
              open={showImageViewer}
              onClose={() => setShowImageViewer(false)}
              imageUrl={todo.images[0]}
              title={todo.title}
            />
          ) : (
            <ImageGalleryViewer
              open={showImageViewer}
              onClose={() => setShowImageViewer(false)}
              images={todo.images}
              initialIndex={selectedImageIndex}
              title={todo.title}
            />
          )}
        </>
      )}
    </>
  );
}
