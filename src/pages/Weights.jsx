import { useEffect, useState } from 'react';
import { getAnimals } from '../services/animalService';
import { addWeight, getWeightsByAnimal, getAverageDailyGain } from '../services/weightService';

export default function Weights() {
  const [animals, setAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [peso, setPeso] = useState('');
  const [weights, setWeights] = useState([]);
  const [gain, setGain] = useState(0);

  useEffect(() => {
    setAnimals(getAnimals());
  }, []);

  const handleAddWeight = () => {
    if (!selectedAnimal || !peso) {
      alert('Selecione o animal e informe o peso');
      return;
    }

    addWeight({
      animalId: Number(selectedAnimal),
      peso
    });

    loadWeights(selectedAnimal);
    setPeso('');
  };

  const loadWeights = (animalId) => {
    const data = getWeightsByAnimal(Number(animalId));
    setWeights(data);

    const g = getAverageDailyGain(Number(animalId));
    setGain(g);
  };

  return (
    <div>
      <h2>⚖️ Controle de Peso</h2>

      {/* Seleção de animal */}
      <select
        value={selectedAnimal}
        onChange={(e) => {
          setSelectedAnimal(e.target.value);
          loadWeights(e.target.value);
        }}
      >
        <option value="">Selecione o animal</option>
        {animals.map((animal) => (
          <option key={animal.id} value={animal.id}>
            {animal.brinco} - {animal.descricao}
          </option>
        ))}
      </select>

      {/* Inserir peso */}
      <div style={{ marginTop: 10 }}>
        <input
          type="number"
          placeholder="Peso (kg)"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
        />

        <button onClick={handleAddWeight}>
          Registrar Peso
        </button>
      </div>

      {/* Resultado */}
      {selectedAnimal && (
        <div style={{ marginTop: 20 }}>
          <h3>📈 Ganho médio diário: {gain} kg/dia</h3>
        </div>
      )}

      {/* Histórico */}
      <table border="1" cellPadding="10" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Data</th>
            <th>Peso</th>
          </tr>
        </thead>
        <tbody>
          {weights.map((w) => (
            <tr key={w.id}>
              <td>{new Date(w.data).toLocaleDateString()}</td>
              <td>{w.peso} kg</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
