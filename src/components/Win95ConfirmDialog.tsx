'use client';

import { Win95Window } from './Win95Window';
import { Win95Button } from './Win95Button';

interface Win95ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function Win95ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: Win95ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-sm">
        <Win95Window title={title} onClose={onCancel}>
          <div className="space-y-4">
            <p className="text-sm text-black">{message}</p>
            <div className="flex gap-2 justify-end">
              <Win95Button onClick={onConfirm} variant="primary">
                OK
              </Win95Button>
              <Win95Button onClick={onCancel}>Cancel</Win95Button>
            </div>
          </div>
        </Win95Window>
      </div>
    </div>
  );
}
