import { useState } from "preact/hooks";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

/**
 * Hook para upload e preview de fotos.
 *
 * Uso:
 *   const { photoPreview, handlePhotoChange, removePhoto, resetPhoto, setPhotoPreview } = usePhotoUpload()
 *
 *   <input type="file" onChange={(e) =>
 *     handlePhotoChange(e, (b64) => setFormData(p => ({...p, photo_url: b64})), showError)
 *   } />
 */
export function usePhotoUpload() {
  const [photoPreview, setPhotoPreview] = useState("");

  const handlePhotoChange = (
    e: Event,
    onSuccess: (base64: string) => void,
    onError?: (msg: string) => void,
  ) => {
    const file = (e.currentTarget as HTMLInputElement).files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      const msg = "Formato inválido. Envie uma imagem JPG, PNG ou WEBP.";
      onError ? onError(msg) : alert(msg);
      return;
    }

    if (file.size > MAX_SIZE) {
      const msg = "A foto deve ter no máximo 2 MB.";
      onError ? onError(msg) : alert(msg);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      setPhotoPreview(result);
      onSuccess(result);
    };
    reader.readAsDataURL(file);
  };

  /** Remove a preview e chama um callback opcional para limpar o formData */
  const removePhoto = (onClear?: () => void) => {
    setPhotoPreview("");
    onClear?.();
  };

  /** Reseta apenas o preview (útil ao fechar/resetar o formulário) */
  const resetPhoto = () => setPhotoPreview("");

  return {
    photoPreview,
    setPhotoPreview,
    handlePhotoChange,
    removePhoto,
    resetPhoto,
  };
}
