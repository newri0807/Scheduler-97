/**
 * Compress and resize image to fit localStorage limits
 * Max size: ~500KB (base64)
 */
export async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Invalid file type'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target?.result) {
        reject(new Error('Failed to read file'));
        return;
      }

      const img = new Image();

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          // Calculate dimensions (max 800px width/height)
          let width = img.width;
          let height = img.height;
          const maxSize = 800;

          if (width > height && width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }

          canvas.width = width;
          canvas.height = height;

          // Draw image with compression
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with quality compression
          let base64 = canvas.toDataURL('image/jpeg', 0.7);

          // Check size (rough estimate: base64 length * 0.75 = bytes)
          let sizeInKB = (base64.length * 0.75) / 1024;

          // Progressive compression if still too large
          if (sizeInKB > 500) {
            base64 = canvas.toDataURL('image/jpeg', 0.5);
            sizeInKB = (base64.length * 0.75) / 1024;
          }

          if (sizeInKB > 500) {
            base64 = canvas.toDataURL('image/jpeg', 0.3);
            sizeInKB = (base64.length * 0.75) / 1024;
          }

          // Verify the base64 string is valid
          if (!base64.startsWith('data:image/')) {
            reject(new Error('Invalid base64 image data'));
            return;
          }

          console.log(`Image compressed: ${file.name}, size: ${sizeInKB.toFixed(2)}KB`);
          resolve(base64);
        } catch (error) {
          reject(new Error('Failed to compress image'));
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = e.target.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Please select an image file' };
  }

  // Check file size (max 10MB original)
  const maxSizeMB = 10;
  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, error: `Image must be smaller than ${maxSizeMB}MB` };
  }

  return { valid: true };
}
