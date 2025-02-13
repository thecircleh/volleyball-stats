import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const StatPreview = ({ logs, teamName, opponentName, currentSet, setCurrentSet }) => {
  // Compute player stats based on logs
  const playerStats = {};
  logs.filter(log => log.set === currentSet).forEach(log => {
    if (!playerStats[log.player]) {
      playerStats[log.player] = { 
        Kills: 0, Errors: 0, 'Total Attacks': 0, Assists: 0, 
        Aces: 0, 'Service Errors': 0, Digs: 0, Blocks: 0 
      };
    }
    if (log.action === 'Attack' && log.result === 'Kill') playerStats[log.player]['Kills']++;
    if (log.action === 'Attack' && log.result === 'Error') playerStats[log.player]['Errors']++;
    if (log.action === 'Attack') playerStats[log.player]['Total Attacks']++;
    if (log.action === 'Set' && log.result === 'Assist') playerStats[log.player]['Assists']++;
    if (log.action === 'Serve' && log.result === 'Ace') playerStats[log.player]['Aces']++;
    if (log.action === 'Serve' && log.result === 'Error') playerStats[log.player]['Service Errors']++;
    if (log.action === 'Dig' && log.result === 'Success') playerStats[log.player]['Digs']++;
    if (log.action === 'Block' && log.result === 'Kill') playerStats[log.player]['Blocks']++;
  });

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(`${teamName} vs. ${opponentName} - NCAA Volleyball Stats`, 10, 10);
    doc.text(`Set ${currentSet}`, 10, 20);

    const tableData = Object.entries(playerStats).map(([player, stats]) => [
      player, stats.Kills, stats.Errors, stats['Total Attacks'], stats.Assists, 
      stats.Aces, stats['Service Errors'], stats.Digs, stats.Blocks
    ]);

    doc.autoTable({
      head: [['Player', 'Kills', 'Errors', 'Total Attacks', 'Assists', 'Aces', 'Service Errors', 'Digs', 'Blocks']],
      body: tableData,
      startY: 30,
    });

    doc.save(`${teamName}_vs_${opponentName}_Set${currentSet}_Stats.pdf`);
  };

  return (
    <div>
      <h2>Match Statistics - Set {currentSet}</h2>
      <div>
        <button onClick={() => setCurrentSet(prev => Math.max(1, prev - 1))}>Previous Set</button>
        <button onClick={() => setCurrentSet(prev => prev + 1)}>Next Set</button>
      </div>
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Player</th>
            <th>Kills</th>
            <th>Errors</th>
            <th>Total Attacks</th>
            <th>Assists</th>
            <th>Aces</th>
            <th>Service Errors</th>
            <th>Digs</th>
            <th>Blocks</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(playerStats).map(([player, stats], index) => (
            <tr key={index}>
              <td>{player}</td>
              <td>{stats.Kills}</td>
              <td>{stats.Errors}</td>
              <td>{stats['Total Attacks']}</td>
              <td>{stats.Assists}</td>
              <td>{stats.Aces}</td>
              <td>{stats['Service Errors']}</td>
              <td>{stats.Digs}</td>
              <td>{stats.Blocks}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={generatePDF}>Export as PDF</button>
    </div>
  );
};

export default StatPreview;


