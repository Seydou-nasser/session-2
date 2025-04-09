import { useState, useEffect } from "react";
import { Capsule } from "../types";
import CapsuleItem from "./CapsuleItem";
import { motion } from "framer-motion";

interface CapsuleListProps {
  capsules: Capsule[];
  onUpdateCapsule: (updatedCapsule: Capsule) => void;
  onDeleteCapsule: (id: string) => void;
}

const CapsuleList = ({
  capsules,
  onUpdateCapsule,
  onDeleteCapsule,
}: CapsuleListProps) => {
  // État pour forcer le re-rendu
  const [, setTick] = useState(0);

  // Effet pour mettre à jour le composant à intervalle régulier
  useEffect(() => {
    // Mise à jour toutes les 40 secondes
    const interval = setInterval(() => {
      setTick((tick) => {
        if (tick > 40) {
          return 0; // Réinitialise le tick
        }
        return tick + 1; // Incrémente l'état pour forcer un re-rendu
      });
    }, 1000); // 1000ms = 1s

    // Nettoyage de l'intervalle à la destruction du composant
    return () => clearInterval(interval);
  }, []);

  if (capsules.length === 0) {
    return (
      <motion.div
        className="flex items-center justify-center m-4 font-serif"
        initial={{ y: -300, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 80,
          damping: 10,
          delay: 0.3,
        }}
      >
        <div className="text-center text-[#af9061] p-6 rounded-lg border border-[#af9061] bg-transparent">
          <p className=" text-lg mb-4">
            Aucune capsule temporelle pour le moment.
          </p>
          <p className="text-base mb-4">
            Vous pouvez créer une capsule temporenelle pour laisser un message à
            <br /> votre futur vous. Créez-en une pour commencer votre voyage
            dans le temps !
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-5 mx-auto p-4">
      {capsules.map((capsule, index) => (
        <motion.div
          key={capsule.id}
          className="w-full sm:w-1/2 lg:w-1/3 flex"
          initial={{ y: -500, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 50,
            damping: 15,
            delay: index * 0.15, // Délai progressif selon l'index
          }}
        >
          <CapsuleItem
            capsule={capsule}
            onUpdateCapsule={onUpdateCapsule}
            onDeleteCapsule={onDeleteCapsule}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default CapsuleList;
