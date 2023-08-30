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

function BarGraph() {
  const labels = ["Pull-up", "Push-up", "Running", "Sit-ups", "Snatch"];

  const data = {
    labels,
    datasets: [
      {
        label: "Win Data",
        data: [1, 2, 3, 4, 5],
        backgroundColor: "rgba(0, 156, 98, 1",
        // backgroundColor: "rgba(175, 225, 175, 0.6)",
      },
      {
        label: "Loss Data",
        data: [1, 2, 3, 4, 5],
        // backgroundColor: "rgba(243, 207, 198, 0.6)",
        backgroundColor: "rgba(210, 4, 45, 1)",
      },
    ],
  };
  return (
    <div className="bar-graph">
      <Bar data={data} options={{ maintainAspectRatio: false }} />
    </div>
  );
}

export default BarGraph;
