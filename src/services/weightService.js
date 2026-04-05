// src/services/weightService.js

const STORAGE_KEY = 'farm_weights';

export const getWeights = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao buscar pesagens:', error);
    return [];
  }
};

export const addWeight = (weight) => {
  const weights = getWeights();

  const newWeight = {
    id: Date.now(),
    animalId: weight.animalId,
    peso: Number(weight.peso),
    data: new Date().toISOString(),
  };

  weights.push(newWeight);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(weights));

  return newWeight;
};

export const getWeightsByAnimal = (animalId) => {
  return getWeights().filter(w => w.animalId === animalId);
};

export const getAverageDailyGain = (animalId) => {
  const weights = getWeightsByAnimal(animalId).sort(
    (a, b) => new Date(a.data) - new Date(b.data)
  );

  if (weights.length < 2) return 0;

  const first = weights[0];
  const last = weights[weights.length - 1];

  const diffPeso = last.peso - first.peso;
  const diffDias =
    (new Date(last.data) - new Date(first.data)) / (1000 * 60 * 60 * 24);

  if (diffDias <= 0) return 0;

  return (diffPeso / diffDias).toFixed(2);
};
