import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "uploads";

let _client: SupabaseClient | null = null;

function supabase(): SupabaseClient | null {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  _client = createClient(url, key, {
    auth: { persistSession: false },
  });
  return _client;
}

export function isSupabaseStorageEnabled(): boolean {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export type UploadResult = {
  url: string;
  filename: string;
  mimeType: string;
  size: number;
};

/**
 * Faz upload de um arquivo.
 * - Se `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` estiverem setados → Supabase Storage (bucket público).
 * - Caso contrário → grava no filesystem local (`public/uploads/`). Útil pra dev e fallback.
 */
export async function uploadFile(file: File): Promise<UploadResult> {
  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const filename = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const client = supabase();
  if (client) {
    // Caminho Supabase Storage
    const { error } = await client.storage
      .from(BUCKET)
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
        cacheControl: "31536000",
      });
    if (error) {
      throw new Error(`Supabase upload failed: ${error.message}`);
    }
    const { data } = client.storage.from(BUCKET).getPublicUrl(filename);
    return {
      url: data.publicUrl,
      filename,
      mimeType: file.type,
      size: file.size,
    };
  }

  // Caminho local (fallback de desenvolvimento)
  const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);
  return {
    url: `/uploads/${filename}`,
    filename,
    mimeType: file.type,
    size: file.size,
  };
}
