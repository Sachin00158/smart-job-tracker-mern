import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function JobPieChart({ stats }) {

  const data = [
    { name: "Applied", value: stats.applied, color: "#3b82f6" },
    { name: "Interview", value: stats.interview, color: "#22c55e" },
    { name: "Rejected", value: stats.rejected, color: "#ef4444" }
  ];

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 mt-8 max-w-3xl ">

      <h2 className="text-lg font-semibold mb-4 text-center">
        Job Distribution
      </h2>

      <ResponsiveContainer width="100%" height={220}>

        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
          >

            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}

          </Pie>

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
}