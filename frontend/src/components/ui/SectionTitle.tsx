import type { ReactNode } from "react";
export function SectionTitle({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="qt-heading">{title}</h1>
        {description && <p className="qt-muted mt-3 max-w-xl">{description}</p>}
      </div>
      {action}
    </div>
  );
}
