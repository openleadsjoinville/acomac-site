"use client";

import { useCallback, useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { X, ZoomIn, ZoomOut, Check, Loader2, RefreshCw } from "lucide-react";

export type CropPreset = {
  label: string;
  width: number;
  height: number;
  aspect: number;
  hint?: string;
};

type Props = {
  open: boolean;
  file: File | null;
  preset: CropPreset;
  onClose: () => void;
  onConfirm: (file: File) => void;
};

async function getCroppedBlob(
  imageSrc: string,
  crop: Area,
  outputW: number,
  outputH: number,
  mime: string
): Promise<Blob> {
  const img = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = outputW;
  canvas.height = outputH;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    img,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    outputW,
    outputH
  );
  return new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b!), mime, 0.92);
  });
}

function createImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.crossOrigin = "anonymous";
    img.src = src;
  });
}

export function CropDialog({ open, file, preset, onClose, onConfirm }: Props) {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!file) {
      setImageSrc("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedArea(null);
  }, [file]);

  const onCropComplete = useCallback((_: Area, areaPx: Area) => {
    setCroppedArea(areaPx);
  }, []);

  async function confirm() {
    if (!file || !croppedArea) return;
    setProcessing(true);
    try {
      const blob = await getCroppedBlob(
        imageSrc,
        croppedArea,
        preset.width,
        preset.height,
        file.type === "image/png" ? "image/png" : "image/jpeg"
      );
      const ext = file.type === "image/png" ? "png" : "jpg";
      const cropped = new File(
        [blob],
        `${file.name.replace(/\.[^.]+$/, "")}-cropped.${ext}`,
        { type: blob.type }
      );
      onConfirm(cropped);
    } finally {
      setProcessing(false);
    }
  }

  if (!open || !file) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(5, 7, 12, 0.85)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: "var(--admin-surface, #14171f)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
          maxHeight: "calc(100vh - 32px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div>
            <h3 className="font-semibold text-white">Ajustar imagem</h3>
            <p className="text-xs" style={{ color: "#8c93a3" }}>
              A imagem será cortada e salva em {preset.width}×{preset.height}px.
              {preset.hint ? ` ${preset.hint}` : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-white/5"
            style={{ color: "#8c93a3" }}
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Cropper */}
        <div
          className="relative"
          style={{ background: "#07090e", minHeight: 400, height: "55vh" }}
        >
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={preset.aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              showGrid
              zoomWithScroll
              style={{
                containerStyle: { background: "#07090e" },
              }}
            />
          )}
        </div>

        {/* Controls */}
        <div
          className="flex items-center gap-3 px-5 py-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <button
            onClick={() => setZoom((z) => Math.max(1, z - 0.1))}
            className="p-2 rounded-md hover:bg-white/5"
            style={{ color: "#8c93a3" }}
            aria-label="Diminuir zoom"
          >
            <ZoomOut size={14} />
          </button>
          <input
            type="range"
            min={1}
            max={4}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-orange-500"
          />
          <button
            onClick={() => setZoom((z) => Math.min(4, z + 0.1))}
            className="p-2 rounded-md hover:bg-white/5"
            style={{ color: "#8c93a3" }}
            aria-label="Aumentar zoom"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={() => {
              setZoom(1);
              setCrop({ x: 0, y: 0 });
            }}
            className="p-2 rounded-md hover:bg-white/5 ml-1"
            style={{ color: "#8c93a3" }}
            aria-label="Resetar"
            title="Resetar corte"
          >
            <RefreshCw size={13} />
          </button>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-2 px-5 py-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/5"
            style={{ color: "#8c93a3" }}
          >
            Cancelar
          </button>
          <button
            onClick={confirm}
            disabled={processing || !croppedArea}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
            style={{
              background: "#F6811E",
              boxShadow: "0 4px 14px rgba(246,129,30,0.35)",
            }}
          >
            {processing ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Enviando…
              </>
            ) : (
              <>
                <Check size={14} /> Aplicar corte
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
