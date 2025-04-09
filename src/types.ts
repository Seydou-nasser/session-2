export interface Capsule {
  id: string;
  title: string;
  message: string;
  unlockDate: string;
  createdAt: string;
  opened: boolean;
  mediaType?: "image" | "video" | null; // Type du média (image ou vidéo)
  mediaPath?: string | null; // Chemin d'accès au fichier média
}
