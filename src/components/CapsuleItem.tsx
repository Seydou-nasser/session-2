import { useState } from "react";
import dayjs from "dayjs";
import { Capsule } from "../types";
import { LockKeyhole, Mail, FileIcon } from "lucide-react";
import { motion } from "framer-motion";
import sablierImg from "../assets/hourglass.png";

interface CapsuleItemProps {
  capsule: Capsule;
  onUpdateCapsule: (updatedCapsule: Capsule) => void;
  onDeleteCapsule: (id: string) => void;
}

const CapsuleItem = ({
  capsule,
  onUpdateCapsule,
  onDeleteCapsule,
}: CapsuleItemProps) => {
  const [isOpen, setIsOpen] = useState(capsule.opened);
  const [mediaError, setMediaError] = useState(false);

  const isUnlockable = (date: string): boolean => {
    return dayjs().isAfter(dayjs(date));
  };

  const handleOpen = () => {
    if (isUnlockable(capsule.unlockDate) && !isOpen) {
      setIsOpen(true);
      onUpdateCapsule({ ...capsule, opened: true });
    }
  };

  const handleMediaError = () => {
    console.log("Erreur de chargement du média", capsule.mediaPath);
    setMediaError(true);
  };

  const calculateTimeRemaining = (date: string): string => {
    const now = dayjs();
    const unlockDate = dayjs(date);

    if (now.isAfter(unlockDate)) return "Prête à ouvrir";

    const diffDays = unlockDate.diff(now, "day");

    if (diffDays > 30) {
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} mois restants`;
    }

    if (diffDays > 0) {
      return `${diffDays} jours restants`;
    }

    const diffHours = unlockDate.diff(now, "hour");
    if (diffHours > 0) {
      return `${diffHours} heures restantes`;
    }

    const diffMinutes = unlockDate.diff(now, "minute");
    if (diffMinutes > 0) {
      return `${diffMinutes} minutes restantes`;
    }

    const diffSeconds = unlockDate.diff(now, "second");
    return `${diffSeconds} seconds restantes`;
  };

  // Calculer un coefficient de vitesse d'animation basé sur le temps restant
  const getAnimationSpeed = (date: string): number => {
    const now = dayjs();
    const unlockDate = dayjs(date);

    if (now.isAfter(unlockDate)) return 0; // Arrêté si déjà débloqué

    const totalDays = unlockDate.diff(now, "day");

    if (totalDays > 30) return 4; // Rotation lente si beaucoup de temps
    if (totalDays > 7) return 3;
    if (totalDays > 1) return 2;

    return 1; // Rotation rapide si proche de la date
  };

  const unlockable = isUnlockable(capsule.unlockDate);
  const animationSpeed = getAnimationSpeed(capsule.unlockDate);

  // Récupérer le nom du fichier à partir du chemin complet
  const getFileName = (path: string | null | undefined) => {
    if (!path) return "";
    return path.split("\\").pop() || path.split("/").pop() || path;
  };

  return (
    <motion.div
      className="mb-4 bg-[#f1dfc0] rounded-lg shadow-lg border border-[#413119] p-4 flex-1 h-full"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-serif text-[#34210e]">{capsule.title}</h3>
        <span className="text-sm px-2 py-1 rounded-full">
          {unlockable ? (
            <div className="flex items-center">
              <motion.button
                onClick={handleOpen}
                className="btn-primary"
                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <Mail className="text-4xl" />
              </motion.button>
            </div>
          ) : (
            <div className="flex items-center">
              <motion.div
                animate={{ rotateY: [0, 30, 0] }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 2,
                  repeatDelay: 1,
                }}
              >
                <LockKeyhole />
              </motion.div>
            </div>
          )}
        </span>
      </div>
      {!isOpen && !unlockable && (
        <div className="text-sm text-gray-500">
          <p className="font-medium text-amber-600 mt-1 flex items-center">
            <motion.img
              src={sablierImg}
              alt="Sablier"
              className="w-6 h-6 mr-2"
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: animationSpeed,
              }}
            />
            {calculateTimeRemaining(capsule.unlockDate)}
          </p>
          {capsule.mediaType && (
            <div className="flex items-center gap-1 mt-2 text-gray-500">
              <FileIcon className="size-4" />
              <span>
                Contient une {capsule.mediaType === "image" ? "image" : "vidéo"}
              </span>
            </div>
          )}
        </div>
      )}

      {isOpen ? (
        <motion.div
          className="mt-2"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-[#785b36]">
            <h4 className="font-medium">Message: {capsule.message}</h4>

            {capsule.mediaPath && capsule.mediaType && (
              <motion.div
                className="mt-4 p-2 bg-white/50 rounded-lg shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h5 className="font-medium mb-2 text-sm text-gray-700">
                  Média joint:
                </h5>
                {mediaError ? (
                  <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
                    <p>
                      Impossible d'accéder au média. Le fichier a peut-être été
                      déplacé ou supprimé.
                    </p>
                    <p className="mt-1 text-xs">
                      {getFileName(capsule.mediaPath)}
                    </p>
                  </div>
                ) : capsule.mediaType === "image" ? (
                  <img
                    src={capsule.mediaPath || ""}
                    alt="Image de la capsule"
                    className="max-w-full rounded mx-auto max-h-64 object-contain"
                    onError={handleMediaError}
                  />
                ) : (
                  <video
                    src={capsule.mediaPath || ""}
                    controls
                    className="w-full rounded max-h-64"
                    onError={handleMediaError}
                  />
                )}
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {getFileName(capsule.mediaPath)}
                </p>
              </motion.div>
            )}
          </div>

          <div className="flex justify-end mt-4">
            <motion.button
              onClick={() => onDeleteCapsule(capsule.id)}
              className="btn-danger text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Supprimer
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <div className="flex justify-end items-end mt-auto">
          {unlockable ? (
            <motion.button
              onClick={handleOpen}
              className=""
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ouvrir la capsule
            </motion.button>
          ) : (
            <button className="opacity-50 cursor-not-allowed" disabled>
              C'est pour bientot !
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default CapsuleItem;
