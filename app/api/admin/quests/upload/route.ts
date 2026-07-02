import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";

/**
 * Uploads a single image (featured / card / gallery) to the public `quests`
 * storage bucket and returns its public URL. Admin-only. The QuestEditorBridge
 * calls this before saving and stores the returned URL on the quest row.
 */
export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { sb } = auth;

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File) || file.size === 0)
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  if (file.size > 5 * 1024 * 1024)
    return NextResponse.json({ error: "Image must be 5MB or smaller." }, { status: 400 });

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${crypto.randomUUID()}.${ext || "jpg"}`;

  const { error } = await sb.storage
    .from("quests")
    .upload(path, file, { contentType: file.type || "image/jpeg", upsert: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = sb.storage.from("quests").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
