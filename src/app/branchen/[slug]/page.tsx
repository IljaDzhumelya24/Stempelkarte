import { notFound } from "next/navigation";
import { branchen } from "@/lib/data";
import BrancheSubpageClient from "./ClientPage";

// Server Component handles the async params lookup perfectly
export default async function BrancheSubpage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const data = branchen.find(b => b.slug === resolvedParams.slug);
  
  if (!data) notFound();

  // Pass the raw, resolved data down to the client component for rendering and animation
  return <BrancheSubpageClient data={data} />;
}
