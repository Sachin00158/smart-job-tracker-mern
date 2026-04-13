import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Cell,
    CartesianGrid,
    Tooltip
} from "recharts";

export default function JobChart({ stats }) {

    const data = [
        { name: "Applied", value: stats.applied },
        { name: "Interview", value: stats.interview },
        { name: "Rejected", value: stats.rejected },
    ];

    // ✅ Blue Theme Colors
    const COLORS = ["#3B82F6", "#06B6D4", "#60A5FA"];

    return (
        <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">

            <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
                📊 Job Analytics
            </h2>

            <ResponsiveContainer width="100%" height={250}>

                <BarChart data={data} barCategoryGap="20%">

                    {/* GRID */}
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

                    {/* X AXIS */}
                    <XAxis
                        dataKey="name"
                        stroke="#64748b"
                        tick={{ fontSize: 12 }}
                    />

                    {/* Y AXIS */}
                    <YAxis
                        stroke="#64748b"
                        allowDecimals={false}
                        tick={{ fontSize: 12 }}
                    />

                    {/* TOOLTIP */}
                    <Tooltip
                        cursor={{ fill: "rgba(59,130,246,0.1)" }}
                        contentStyle={{
                            backgroundColor: "#fff",
                            borderRadius: "10px",
                            border: "1px solid #e2e8f0"
                        }}
                    />

                    {/* BAR */}
                    <Bar
                        dataKey="value"
                        radius={[10, 10, 0, 0]}
                        barSize={50}
                        animationDuration={800}
                    >
                        {data.map((entry, index) => (
                            <Cell key={index} fill={COLORS[index]} />
                        ))}
                    </Bar>

                </BarChart>

            </ResponsiveContainer>

        </div>
    );
}