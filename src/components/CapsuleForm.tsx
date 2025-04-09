import { useState } from "react";
import dayjs from "dayjs";
import { Capsule } from "../types";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { Image, Film } from "lucide-react";

interface CapsuleFormProps {
  onAddCapsule: (capsule: Capsule) => void;
}

const CapsuleForm = ({ onAddCapsule }: CapsuleFormProps) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [formError, setFormError] = useState("");
  const [mediaPath, setMediaPath] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title.trim() || !message.trim() || !unlockDate) {
      setFormError("Veuillez remplir tous les champs");
      return;
    }

    // Vérification de la date (doit être dans le futur)
    const selectedDate = dayjs(unlockDate);
    const now = dayjs();

    if (selectedDate.isBefore(now)) {
      setFormError("La date d'ouverture doit être dans le futur");
      return;
    }

    // Création d'une nouvelle capsule
    const newCapsule: Capsule = {
      id: Date.now().toString(),
      title: title.trim(),
      message: message.trim(),
      unlockDate: unlockDate,
      createdAt: new Date().toISOString(),
      opened: false,
      mediaType: mediaType,
      mediaPath: mediaPath,
    };

    // Envoi de la capsule au composant parent
    onAddCapsule(newCapsule);

    // Réinitialisation du formulaire
    setTitle("");
    setMessage("");
    setUnlockDate("");
    setMediaPath(null);
    setMediaType(null);
    setPreviewUrl(null);
    setFormError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setMediaPath(null);
      setMediaType(null);
      setPreviewUrl(null);
      return;
    }

    // Déterminer si c'est une image ou une vidéo
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      setFormError(
        "Format de fichier non supporté. Veuillez choisir une image ou une vidéo."
      );
      return;
    }

    // Enregistrer le chemin complet du fichier
    const filePath = e.target.value;
    setMediaPath(filePath);
    setMediaType(isImage ? "image" : "video");

    // Créer une URL pour la prévisualisation
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => {
      // Nettoyer l'URL lors du démontage
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  };

  const resetMedia = () => {
    setMediaPath(null);
    setMediaType(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <Dialog
      onOpenChange={() => {
        setFormError("");
        setTitle("");
        setMessage("");
        setUnlockDate("");
        setMediaPath(null);
        setMediaType(null);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <div className="flex justify-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              onClick={() => {}}
              className="text-xl font-sans-serif border-2 p-5 border-[#413119] bg-[#e0c79e] text-[#442e0c] hover:bg-[#d1b78c] rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-115"
            >
              Crée une nouvelle capsule
            </Button>
          </motion.div>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] border border-[#413119] bg-[#f1dfc0] text-[#413119] rounded-lg p-6 shadow-lg max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-center text-2xl font-serif mb-4">
          Créer une Capsule Temporelle
          {formError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded"
            >
              <p>{formError}</p>
            </motion.div>
          )}
        </DialogTitle>
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="mb-4"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <label
              htmlFor="title"
              className="block text-gray-700 font-medium mb-1"
            >
              Titre de la capsule
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="ring-1 w-full ring-[#413119] rounded-sm p-2 focus:ring-2 focus:outline-none focus:ring-[#413119]"
              placeholder="Un message pour mon futur moi..."
            />
          </motion.div>

          <motion.div
            className="mb-4"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label
              htmlFor="message"
              className="block text-gray-700 font-medium mb-1"
            >
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="ring-1 w-full ring-[#413119] rounded-sm p-2 focus:ring-2 focus:outline-none focus:ring-[#413119]"
              placeholder="Écris ton message ici..."
            />
          </motion.div>

          <motion.div
            className="mb-4"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <label
              htmlFor="media"
              className="block text-gray-700 font-medium mb-1"
            >
              Ajouter un média (optionnel)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                id="media"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="media"
                className="cursor-pointer flex items-center justify-center gap-2 px-3 py-2 bg-[#e0c79e] text-[#442e0c] rounded-md hover:bg-[#d1b78c] transition-colors"
              >
                <span className="flex items-center gap-1">
                  <Image className="size-4" />
                  <Film className="size-4" />
                </span>
                Choisir un fichier
              </label>
              {mediaPath && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetMedia}
                  className="text-sm"
                >
                  Supprimer
                </Button>
              )}
            </div>

            {previewUrl && mediaType && (
              <motion.div
                className="mt-2 p-2 bg-gray-100 rounded-md"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                {mediaType === "image" ? (
                  <img
                    src={previewUrl}
                    alt="Aperçu"
                    className="max-h-40 mx-auto rounded"
                  />
                ) : (
                  <video
                    src={previewUrl}
                    className="max-h-40 w-full rounded"
                    controls
                  />
                )}
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {mediaPath?.split("\\").pop()}
                </p>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            className="mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label
              htmlFor="unlockDate"
              className="block text-gray-700 font-medium mb-1"
            >
              Date d'ouverture
            </label>

            <p className="text-sm text-gray-500 mb-2">
              Sélectionnez une date et une heure dans le futur
            </p>
            <input
              type="datetime-local"
              id="unlockDate"
              value={unlockDate}
              onChange={(e) => setUnlockDate(e.target.value)}
              className="ring-1 w-full ring-[#413119] rounded-sm p-2 focus:ring-2 focus:outline-none focus:ring-[#413119]"
              placeholder="Sélectionne une date"
              min={dayjs().format("YYYY-MM-DDTHH:mm")}
            />
          </motion.div>

          <motion.button
            type="submit"
            className="text-xl font-sans-serif border-2 p-1 border-[#413119] bg-[#e0c79e] text-[#442e0c] hover:bg-[#d1b78c] rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Créer ma capsule temporelle
          </motion.button>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
};

export default CapsuleForm;
