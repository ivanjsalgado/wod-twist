import "./BarGraph.scss";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function BarGraph({ history }) {
  const win = {};
  const lose = {};
  const winData = [];
  const loseData = [];

  history.forEach((match) => {
    const movementsToCount = match.result === "Victory" ? win : lose;

    match.movements.forEach((movement) => {
      movementsToCount[movement] = (movementsToCount[movement] || 0) + 1;
    });
  });

  const allMovements = Object.keys(win).concat(Object.keys(lose)).sort();
  const movements = [...new Set(allMovements)];

  movements.map((movement) => {
    win[movement] === undefined ? winData.push(0) : winData.push(win[movement]);
    lose[movement] === undefined
      ? loseData.push(0)
      : loseData.push(lose[movement]);
  });

  const labels = movements;

  const data = {
    labels,
    datasets: [
      {
        label: "Win Data",
        data: winData,
        backgroundColor: "rgba(0, 156, 98, 1",
        // backgroundColor: "rgba(175, 225, 175, 0.6)",
      },
      {
        label: "Loss Data",
        data: loseData,
        // backgroundColor: "rgba(243, 207, 198, 0.6)",
        backgroundColor: "rgba(210, 4, 45, 1)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: "Graph",
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Matches",
        },
        ticks: {
          precision: 0,
        },
        min: 0,
        max: history.length,
      },
      x: {
        title: {
          display: true,
          text: "Movements",
        },
      },
    },
  };

  return (
    <div className="bar">
      <h1 className="bar__heading">User's Stats</h1>
      <Bar data={data} options={options} />
    </div>
  );
}

export default BarGraph;
