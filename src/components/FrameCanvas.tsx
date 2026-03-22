import { useEffect, useRef, useCallback } from "react";
import "./styles/FrameCanvas.css";

interface FrameCanvasProps {
  onProgress?: (percent: number) => void;
  onReady?: () => void;
}

const FRAME_COUNT = 240;

const FrameCanvas = ({ onProgress, onReady }: FrameCanvasProps) => {
  const fgCanvasRef = useRef<HTMLCanvasElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const loadedCountRef = useRef(0);
  const isReadyRef = useRef(false);

  const drawCover = useCallback(
    (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, img: HTMLImageElement) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    },
    []
  );

  const renderFrame = useCallback(
    (index: number) => {
      const img = framesRef.current[index];
      if (!img || !img.complete || img.naturalWidth === 0) return;
      currentFrameRef.current = index;

      const fgCanvas = fgCanvasRef.current;
      const bgCanvas = bgCanvasRef.current;
      if (!fgCanvas || !bgCanvas) return;

      const fgCtx = fgCanvas.getContext("2d");
      const bgCtx = bgCanvas.getContext("2d");
      if (!fgCtx || !bgCtx) return;

      drawCover(fgCtx, fgCanvas, img);
      drawCover(bgCtx, bgCanvas, img);
    },
    [drawCover]
  );

  const sizeCanvases = useCallback(() => {
    const fgCanvas = fgCanvasRef.current;
    const bgCanvas = bgCanvasRef.current;
    if (!fgCanvas || !bgCanvas) return;

    fgCanvas.width = window.innerWidth;
    fgCanvas.height = window.innerHeight + 72;
    bgCanvas.width = Math.ceil(window.innerWidth * 1.1);
    bgCanvas.height = Math.ceil(window.innerHeight * 1.1);

    if (isReadyRef.current) {
      renderFrame(currentFrameRef.current);
    }
  }, [renderFrame]);

  useEffect(() => {
    sizeCanvases();

    // Preload all frames
    const frames: HTMLImageElement[] = [];
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const idx = String(i).padStart(3, "0");
      img.src = `/frames/ezgif-frame-${idx}.jpg`;
      img.onload = () => {
        loadedCountRef.current++;
        const pct = Math.round((loadedCountRef.current / FRAME_COUNT) * 100);
        onProgress?.(pct);

        if (loadedCountRef.current >= FRAME_COUNT) {
          isReadyRef.current = true;
          renderFrame(0);
          onReady?.();
        }
      };
      img.onerror = () => {
        loadedCountRef.current++;
        if (loadedCountRef.current >= FRAME_COUNT) {
          isReadyRef.current = true;
          renderFrame(0);
          onReady?.();
        }
      };
      frames.push(img);
    }
    framesRef.current = frames;

    // Resize handler
    let timer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => sizeCanvases(), 150);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [onProgress, onReady, renderFrame, sizeCanvases]);

  // Expose renderFrame for scroll updates
  useEffect(() => {
    (window as any).__renderFrame = renderFrame;
    (window as any).__frameCount = FRAME_COUNT;
    return () => {
      delete (window as any).__renderFrame;
      delete (window as any).__frameCount;
    };
  }, [renderFrame]);

  return (
    <>
      <canvas ref={bgCanvasRef} className="frame-canvas-bg" />
      <canvas ref={fgCanvasRef} className="frame-canvas-fg" />
    </>
  );
};

export default FrameCanvas;
