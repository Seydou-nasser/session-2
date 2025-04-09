import { useEffect, useState } from "react";
import "./App.css";
import { Capsule } from "./types";
import CapsuleForm from "./components/CapsuleForm";
import CapsuleList from "./components/CapsuleList";
import { motion } from "framer-motion";

function App() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);

  // Chargement des capsules depuis le localStorage au montage du composant
  useEffect(() => {
    loadFromStorage();
  }, []);

  // Sauvegarde des capsules dans le localStorage
  const saveToStorage = (capsulesToSave: Capsule[]) => {
    localStorage.setItem("capsules", JSON.stringify(capsulesToSave));
  };

  // Récupération des capsules depuis le localStorage
  const loadFromStorage = () => {
    const saved = localStorage.getItem("capsules");
    if (saved) {
      try {
        setCapsules(JSON.parse(saved));
      } catch (error) {
        console.error("Erreur lors du chargement des capsules:", error);
        setCapsules([]);
      }
    }
  };

  // Ajouter une nouvelle capsule
  const handleAddCapsule = (newCapsule: Capsule) => {
    const updatedCapsules = [newCapsule, ...capsules];
    setCapsules(updatedCapsules);
    saveToStorage(updatedCapsules);
  };

  // Mettre à jour une capsule existante
  const handleUpdateCapsule = (updatedCapsule: Capsule) => {
    const updatedCapsules = capsules.map((capsule) =>
      capsule.id === updatedCapsule.id ? updatedCapsule : capsule
    );
    setCapsules(updatedCapsules);
    saveToStorage(updatedCapsules);
  };

  // Supprimer une capsule
  const handleDeleteCapsule = (id: string) => {
    const updatedCapsules = capsules.filter((capsule) => capsule.id !== id);
    setCapsules(updatedCapsules);
    saveToStorage(updatedCapsules);
  };

  return (
    <div className="container mx-auto px-4 py-8 m-0">
      <motion.header
        className="text-center mb-8 font-serif"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        <h1 className="text-4xl mb-2 text-[#543c1b]">
          Capsule Temporelle Digitale
        </h1>
        <p className="text-[#af9061]">
          Laissez un message à votre futur vous-même
        </p>
      </motion.header>

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
      >
        <CapsuleForm onAddCapsule={handleAddCapsule} />
      </motion.div>

      <CapsuleList
        capsules={capsules}
        onUpdateCapsule={handleUpdateCapsule}
        onDeleteCapsule={handleDeleteCapsule}
      />
    </div>
  );
}

export default App;
