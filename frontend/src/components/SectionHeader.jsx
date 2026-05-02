export const SectionHeader = ({ eyebrow, title, description, action }) => (
  <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      {eyebrow ? (
        <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "rgb(var(--text-soft))" }}>
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 font-display text-2xl">{title}</h2>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm" style={{ color: "rgb(var(--text-soft))" }}>
          {description}
        </p>
      ) : null}
    </div>
    {action}
  </div>
);

