// src/services/dashboardService.js

import { getAnimals } from './animalService';
import { getWeights } from './weightService';

export const getDashboardData = () => {
  const animals = getAnimals();
  const weights = getWeights();

  const totalAnimals = animals.length;

  // Último peso de cada animal
  const latestWeights = animals.map(animal => {
    const animalWeights = weights
      .filter(w => w.animalId === animal.id)
      .sort((a, b) => new Date(b.data) - new Date(a.data));

    return animalWeights[0];
  }).filter(Boolean);

  // Peso médio
  const avgWeight =
    latestWeights.length > 0
      ? (
          latestWeights.reduce((sum, w) => sum + w.peso, 0) /
          latestWeights.length
        ).toFixed(2)
      : 0;

  // Ganho médio diário geral
  const gains = animals.map(animal => {
    const animalWeights = weights
      .filter(w => w.animalId === animal.id)
      .sort((a, b) => new Date(a.data) - new Date(b.data));

    if (animalWeights.length < 2) return 0;

    const first = animalWeights[0];
    const last = animalWeights[animalWeights.length - 1];

    const diffPeso = last.peso - first.peso;
    const diffDias =
      (new Date(last.data) - new Date(first.data)) / (1000 * 60 * 60 * 24);

    if (diffDias <= 0) return 0;

    return diffPeso / diffDias;
  });

  const avgGain =
    gains.length > 0
      ? (
          gains.reduce((sum, g) => sum + g, 0) / gains.length
        ).toFixed(2)
      : 0;

  return {
    totalAnimals,
    avgWeight,
    avgGain
  };
};
