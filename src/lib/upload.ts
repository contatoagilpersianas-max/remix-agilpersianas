import { supabase } from "@/integrations/supabase/client";

const BUCKET = "product-media";

export async function uploadToProductMedia(file: File, folder = "misc"): Promise<{ url: string; path: string; sizeKb: number }> {
  const ext = file.name.split(".").pop() || "bin";
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-").toLowerCase();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || `image/${ext}`,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path, sizeKb: Math.round(file.size / 1024) };
}

export async function deleteFromProductMedia(url: string): Promise<void> {
  // Extract path after /product-media/
  const m = url.match(/\/product-media\/(.+)$/);
  if (!m) return;
  await supabase.storage.from(BUCKET).remove([m[1]]);
}
