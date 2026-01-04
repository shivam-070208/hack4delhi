"use client";

export default function HrStatCard({ title, items }) {
  return (
    <div className="bg-card border-border cursor-pointer rounded-2xl border p-6 shadow-sm transition hover:shadow-md">
      <h3 className="mb-4 text-base font-semibold tracking-tight">{title}</h3>

      <ul className="text-muted-foreground space-y-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="hover:text-foreground">
            • {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
