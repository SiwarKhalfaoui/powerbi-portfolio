import { useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { uploadImageRequest } from '../../lib/uploads';
import { getErrorMessage } from '../../lib/errors';

interface ImageUploadFieldProps {
  label: string;
  images: string[];
  onChange: (images: string[]) => void;
  multiple?: boolean;
  maxImages?: number;
  helpText?: string;
}

export function ImageUploadField({
  label,
  images,
  onChange,
  multiple = false,
  maxImages = multiple ? 10 : 1,
  helpText,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setError(null);

    const files = Array.from(fileList).slice(0, Math.max(0, maxImages - images.length));
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of files) {
        const url = await uploadImageRequest(file);
        uploadedUrls.push(url);
      }
      onChange(multiple ? [...images, ...uploadedUrls] : uploadedUrls);
    } catch (err) {
      setError(getErrorMessage(err, "Échec de l'envoi de l'image."));
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function removeAt(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  const canAddMore = images.length < maxImages;

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-mist-900">{label}</p>
      {helpText && <p className="mb-2 text-xs text-mist-400">{helpText}</p>}

      <div className="flex flex-wrap gap-3">
        {images.map((url, index) => (
          <div key={url} className="group relative h-24 w-24 overflow-hidden rounded-lg border border-mist-200">
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(index)}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink-950/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Supprimer l'image"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {canAddMore && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-mist-200 text-mist-400 transition-colors hover:border-teal hover:text-teal-700 disabled:opacity-50"
          >
            {isUploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <ImagePlus className="h-5 w-5" />
                <span className="text-[11px] font-medium">Ajouter</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="mt-1.5 text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}