import { useEffect, useState } from 'react';
import { getAnimals, addAnimal, deleteAnimal } from '../services/animalService';

export default function Animals() {
  const [animals, setAnimals] = useState([]);
  const [form, setForm] = useState({
    brinco: '',
    descricao: '',
    peso: ''
  });

  useEffect(() => {
    loadAnimals();
  }, []);

  const loadAnimals = () => {
    const data = getAnimals();
    setAnimals(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.brinco) {
      alert('Informe o brinco');
      return;
    }

    addAnimal(form);

    setForm({
      brinco: '',
      descricao: '',
      peso: ''
    });

    loadAnimals();
  };

  const handleDelete = (id) => {
    if (window.confirm('Deseja excluir este animal?')) {
      deleteAnimal(id);
      loadAnimals();
    }
  };

  return (
    <div>
      <h2>🐄 Rebanho</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          placeholder="Brinco"
          value={form.brinco}
          onChange={(e) => setForm({ ...form, brinco: e.target.value })}
        />

        <input
          placeholder="Descrição"
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
        />

        <input
          placeholder="Peso"
          type="number"
          value={form.peso}
          onChange={(e) => setForm({ ...form, peso: e.target.value })}
        />

        <button type="submit">Cadastrar Animal</button>
      </form>

      {/* LISTA */}
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Brinco</th>
            <th>Descrição</th>
            <th>Peso</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {animals.map((animal) => (
            <tr key={animal.id}>
              <td>{animal.brinco}</td>
              <td>{animal.descricao}</td>
              <td>{animal.peso} kg</td>
              <td>
                <button onClick={() => handleDelete(animal.id)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
