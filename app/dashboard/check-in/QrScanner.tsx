"use client";

import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { CameraOff, CircleCheck, Clock, LoaderCircle, TriangleAlert } from "lucide-react";

export type ScanFeedback =
  | { tone: "success" | "info"; title: string; detail?: string }
  | { tone: "error"; title: string; detail?: string }
  | null;

const SCAN_INTERVAL_MS = 150;
/** Ignore the same code for a moment so one scan isn't submitted twice. */
const REPEAT_COOLDOWN_MS = 4000;

/**
 * Live camera QR reader. Calls `onCode` with each ActiveZone pass it sees.
 * Needs HTTPS (or localhost) for camera access.
 */
export function QrScanner({
  onCode,
  busy,
  feedback,
}: {
  onCode: (code: string) => void;
  busy: boolean;
  feedback: ScanFeedback;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onCodeRef = useRef(onCode);
  const busyRef = useRef(busy);
  const lastRef = useRef<{ code: string; at: number } | null>(null);
  const [status, setStatus] = useState<"starting" | "live" | "error">("starting");
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    onCodeRef.current = onCode;
    busyRef.current = busy;
  }, [onCode, busy]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let timer: ReturnType<typeof setInterval> | undefined;
    let stopped = false;

    async function start() {
      if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
        setCameraError("The camera only works on a secure (https) connection. Open the dashboard over https, or use a USB scanner in the search box.");
        setStatus("error");
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (stopped) return stream.getTracks().forEach((t) => t.stop());
        const video = videoRef.current!;
        video.srcObject = stream;
        await video.play();
        setStatus("live");
        timer = setInterval(scanFrame, SCAN_INTERVAL_MS);
      } catch (err) {
        const name = (err as DOMException).name;
        setCameraError(
          name === "NotAllowedError"
            ? "Camera access was blocked. Allow the camera for this site in your browser settings, then reopen the scanner."
            : name === "NotFoundError"
              ? "No camera was found on this device. You can still use a USB scanner in the search box."
              : "The camera couldn't be started. Close other apps using it and try again.",
        );
        setStatus("error");
      }
    }

    function scanFrame() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || busyRef.current || video.readyState < 2) return;
      // Downscale for speed; QR passes are large on screen so this is plenty.
      const scale = Math.min(1, 640 / video.videoWidth);
      const w = Math.round(video.videoWidth * scale);
      const h = Math.round(video.videoHeight * scale);
      if (!w || !h) return;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, w, h);
      const found = jsQR(ctx.getImageData(0, 0, w, h).data, w, h, { inversionAttempts: "dontInvert" });
      const code = found?.data?.trim();
      if (!code) return;
      const now = Date.now();
      const last = lastRef.current;
      if (last && last.code === code && now - last.at < REPEAT_COOLDOWN_MS) return;
      lastRef.current = { code, at: now };
      onCodeRef.current(code);
    }

    start();
    return () => {
      stopped = true;
      clearInterval(timer);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden bg-black">
        <video ref={videoRef} muted playsInline className="size-full object-cover" />
        <canvas ref={canvasRef} className="hidden" />

        {status === "live" && (
          // Framing guide
          <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="size-[58%] max-h-[80%] border-2 border-brand/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
          </div>
        )}
        {status === "starting" && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-zinc-400">
            <LoaderCircle size={18} className="animate-spin" aria-hidden /> Starting camera…
          </div>
        )}
        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-sm text-zinc-300">
            <CameraOff size={28} className="text-zinc-500" aria-hidden />
            {cameraError}
          </div>
        )}
        {busy && (
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-black/70 py-2 text-sm text-white">
            <LoaderCircle size={16} className="animate-spin" aria-hidden /> Checking pass…
          </div>
        )}
      </div>

      <div aria-live="polite" className="min-h-[4.5rem]">
        {feedback ? (
          <div
            className={`mt-4 flex items-start gap-3 border p-4 text-sm ${
              feedback.tone === "success"
                ? "border-brand/40 bg-brand/10"
                : feedback.tone === "info"
                  ? "border-sky-300/30 bg-sky-300/[0.07]"
                  : "border-red-400/30 bg-red-400/[0.07]"
            }`}
          >
            {feedback.tone === "success" ? (
              <CircleCheck size={20} className="shrink-0 text-brand" aria-hidden />
            ) : feedback.tone === "info" ? (
              <Clock size={20} className="shrink-0 text-sky-200" aria-hidden />
            ) : (
              <TriangleAlert size={20} className="shrink-0 text-red-300" aria-hidden />
            )}
            <p>
              <span className="block font-semibold text-white">{feedback.title}</span>
              {feedback.detail && <span className="text-zinc-400">{feedback.detail}</span>}
            </p>
          </div>
        ) : (
          status === "live" && <p className="mt-4 text-center text-sm text-zinc-500">Hold the member&apos;s QR pass inside the frame.</p>
        )}
      </div>
    </div>
  );
}
