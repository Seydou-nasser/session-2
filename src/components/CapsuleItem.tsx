import { useState } from "react";
import dayjs from "dayjs";
import { Capsule } from "../types";
import { LockKeyhole, Mail } from "lucide-react";
import { motion } from "framer-motion";

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
  const isUnlockable = (date: string): boolean => {
    return dayjs().isAfter(dayjs(date));
  };

  const handleOpen = () => {
    if (isUnlockable(capsule.unlockDate) && !isOpen) {
      setIsOpen(true);
      onUpdateCapsule({ ...capsule, opened: true });
    }
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

  const unlockable = isUnlockable(capsule.unlockDate);

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
          <p className="font-medium text-amber-600 mt-1">
            {calculateTimeRemaining(capsule.unlockDate)}
          </p>
        </div>
      )}

      {isOpen ? (
        <motion.div
          className="mt-2 min"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-[#785b36]">
            <h4 className="font-medium">Message: {capsule.message}</h4>
          </div>

          <div className="flex justify-end">
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
              Pas encore disponible
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default CapsuleItem;
