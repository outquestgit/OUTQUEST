import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getIndustryBySlug,
  getBusinessModelsForIndustry,
} from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

type Params = Promise<{ industrySlug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { industrySlug } = await params;
  const industry = await getIndustryBySlug(industrySlug);
  if (!industry) return {};
  return buildMetadata(industry, {
    title: `${industry.name} Suppliers`,
    description: industry.description ?? undefined,
    path: `/industry/${industry.slug}`,
  });
}

export default async function IndustryPage({ params }: { params: Params }) {
  const { industrySlug } = await params;
  const industry = await getIndustryBySlug(industrySlug);
  if (!industry) notFound();

  const models = await getBusinessModelsForIndustry(industry.id);

  return (
    <div className="dir-wrap">
      <nav className="dir-crumb">
        <Link href="/">Home</Link>
        <span className="sep">/</span>
        <span>{industry.name}</span>
      </nav>

      <header className="dir-head">
        <div className="dir-eyebrow">Industry</div>
        <h1 className="dir-h1">{industry.h1 || industry.name}</h1>
        {(industry.intro || industry.description) && (
          <p className="dir-intro">{industry.intro || industry.description}</p>
        )}
      </header>

      <h2 className="dir-section-title">Business models</h2>
      {models.length === 0 ? (
        <div className="dir-empty">No business models published yet.</div>
      ) : (
        <div className="dir-grid">
          {models.map((m) => (
            <Link
              key={m.id}
              href={`/industry/${industry.slug}/${m.slug}`}
              className="dir-card"
            >
              <div className="dir-card-body">
                <h3 className="dir-card-title">{m.name}</h3>
                {m.description && (
                  <div className="dir-card-meta">{m.description}</div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
