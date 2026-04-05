// src/services/weightService.js

const STORAGE_KEY = 'farm_weights';

export const getWeights = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
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
