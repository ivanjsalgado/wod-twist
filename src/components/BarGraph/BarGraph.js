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
  let labels = [];

  const graph = () => {
    history.forEach((match) => {
      const movementsToCount = match.result === "Victory" ? win : lose;

      match.movements.forEach((movement) => {
        movementsToCount[movement] = (movementsToCount[movement] || 0) + 1;
      });
    });

    const allMovements = Object.keys(win).concat(Object.keys(lose)).sort();
    const movements = [...new Set(allMovements)];

    movements.map((movement) => {
      win[movement] === undefined
        ? winData.push(0)
        : winData.push(win[movement]);
      lose[movement] === undefined
        ? loseData.push(0)
        : loseData.push(lose[movement]);
    });

    labels = movements;
  };

  graph();

  const data = {
    labels,
    datasets: [
      {
        label: "Win",
        data: winData,
        backgroundColor: " #6cc955",
        borderColor: "white",
      },
      {
        label: "Loss",
        data: loseData,
        backgroundColor: "rgba(210, 4, 45, 1)",
        borderColor: "white",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },
    title: {
      display: true,
      text: "Graph",
      color: "white",
      font: {
        size: "15",
      },
    },
    scales: {
      y: {
        grid: {
          color: "white",
        },
        title: {
          display: true,
          text: "Matches",
          color: "white",
        },
        ticks: {
          precision: 0,
          color: "white",
          font: {
            size: "12.5",
          },
        },
        min: 0,
        max: history.length,
      },
      x: {
        grid: {
          color: "grey",
        },
        title: {
          display: true,
          text: "Movements",
          color: "white",
        },
        ticks: {
          precision: 0,
          color: "white",
          font: {
            size: "12.5",
          },
        },
      },
    },
  };

  return (
    <div className="bar">
      <Bar data={data} options={options} />
    </div>
  );
}

export default BarGraph;
