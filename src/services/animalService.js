// src/services/animalService.js

const STORAGE_KEY = 'farm_animals';

export const getAnimals = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao buscar animais:', error);
    return [];
  }
};

export const saveAnimals = (animals) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(animals));
  } catch (error) {
    console.error('Erro ao salvar animais:', error);
  }
};

export const addAnimal = (animal) => {
  const animals = getAnimals();

  const newAnimal = {
    id: Date.now(),
    brinco: animal.brinco || '',
    descricao: animal.descricao || '',
    peso: Number(animal.peso) || 0,
    dataCadastro: new Date().toISOString(),
  };

  animals.push(newAnimal);
  saveAnimals(animals);

  return newAnimal;
};

export const deleteAnimal = (id) => {
  const animals = getAnimals().filter(a => a.id !== id);
  saveAnimals(animals);
};

export const updateAnimal = (id, updatedData) => {
  const animals = getAnimals().map(animal =>
    animal.id === id ? { ...animal, ...updatedData } : animal
  );

  saveAnimals(animals);
};
