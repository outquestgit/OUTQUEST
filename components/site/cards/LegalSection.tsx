/** A numbered `.legal-section` block used on the Privacy and Terms pages. */
export function LegalSection({
  id,
  num,
  title,
  children,
}: {
  id: string;
  num: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="legal-section" id={id}>
      <h2>
        <span className="ls-num">{num}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}
