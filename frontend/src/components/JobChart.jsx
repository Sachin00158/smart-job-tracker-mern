import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

export default function JobChart({ stats }) {

    const data = [
        { name: "Applied", value: stats.applied, color: "#3b82f6" },
        { name: "Interview", value: stats.interview, color: "#22c55e" },
        { name: "Rejected", value: stats.rejected, color: "#ef4444" }
    ];

    return (
        <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-xl p-6 mt-8 max-w-3xl">

            <h2 className="text-lg font-semibold mb-4">
                Job Analytics
            </h2>

            <ResponsiveContainer width="100%" height={220}>

                <BarChart data={data} barCategoryGap="15%">

                    <XAxis dataKey="name" stroke="#94a3b8" />

                    <YAxis stroke="#94a3b8" allowDecimals={false} />

                    <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={65}>

                        {data.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                        ))}

                    </Bar>

                </BarChart>

            </ResponsiveContainer>



        </div>

    );
}
