import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function JobPieChart({ stats }) {

  const data = [
    { name: "Applied", value: stats.applied },
    { name: "Interview", value: stats.interview },
    { name: "Rejected", value: stats.rejected }
  ];

  const COLORS = ["#3B82F6", "#22C55E", "#EF4444"];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full">

      {/* Title same as bar chart */}
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        📊 Job Distribution
      </h2>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={4}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip />

        </PieChart>
      </ResponsiveContainer>

    </div>
  );
}