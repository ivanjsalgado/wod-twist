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

function BarGraph() {
  const labels = ["Pull-up", "Push-up", "Running", "Sit-ups", "Snatch"];

  const data = {
    labels,
    datasets: [
      {
        label: "Win Data",
        data: [1, 2, 3, 4, 5],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Loss Data",
        data: [1, 2, 3, 4, 5],
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
  return (
    <div className="bar-graph">
      <Bar data={data} />
    </div>
  );
}

export default BarGraph;
