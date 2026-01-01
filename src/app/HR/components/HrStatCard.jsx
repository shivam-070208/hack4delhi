"use client";

export default function HrStatCard({ title, items }) {
  return (
    <div
      className="bg-card border border-border rounded-2xl p-6 shadow-sm
                 hover:shadow-md transition cursor-pointer"
    >
      <h3 className="font-semibold text-base mb-4 tracking-tight">
        {title}
      </h3>

      <ul className="space-y-2 text-sm text-muted-foreground">
        {items.map((item, index) => (
          <li key={index} className="hover:text-foreground">
            • {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
