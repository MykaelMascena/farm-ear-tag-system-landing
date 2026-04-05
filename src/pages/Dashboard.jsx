import { useEffect, useState } from 'react';
import { getDashboardData } from '../services/dashboardService';

export default function Dashboard() {
  const [data, setData] = useState({
    totalAnimals: 0,
    avgWeight: 0,
    avgGain: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const dashboard = getDashboardData();
    setData(dashboard);
  };

  return (
    <div>
      <h2>📊 Resumo da Fazenda</h2>

      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        
        <div style={{ border: '1px solid #ccc', padding: 20 }}>
          <h3>🐄 Total de Animais</h3>
          <p>{data.totalAnimals}</p>
        </div>

        <div style={{ border: '1px solid #ccc', padding: 20 }}>
          <h3>⚖️ Peso Médio</h3>
          <p>{data.avgWeight} kg</p>
        </div>

        <div style={{ border: '1px solid #ccc', padding: 20 }}>
          <h3>📈 Ganho Médio Diário</h3>
          <p>{data.avgGain} kg/dia</p>
        </div>

      </div>
    </div>
  );
}
