import { X, ZoomInIcon, ZoomOutIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export function Preview({ url, onclose }: { url: string; onclose: () => void }) {
  const isPdf = url.toLowerCase().endsWith(".pdf");

  const [scale, setScale] = useState(1);

  const ref = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ x: 0, y: 0 });

  const handleZoomIn = useCallback(() => {
    setScale((scale) => scale + 0.1);
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((scale) => Math.max(scale - 0.1, 1));
  }, []);

  useEffect(() => {
    const image = ref.current;
    const container = containerRef.current;
    if (!image || !container) {
      return;
    }

    let isDragging = false;

    const clampPosition = (nextX: number, nextY: number) => {
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const imageWidth = image.clientWidth * scale;
      const imageHeight = image.clientHeight * scale;

      const minX = Math.min(0, containerWidth - imageWidth);
      const minY = Math.min(0, containerHeight - imageHeight);

      return {
        x: Math.max(minX, Math.min(0, nextX)),
        y: Math.max(minY, Math.min(0, nextY)),
      };
    };

    const applyTransform = () => {
      image.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px) scale(${scale})`;
    };

    const handleMouseDown = () => {
      isDragging = true;
      image.style.cursor = "grabbing";
    };

    const handleMouseUp = () => {
      isDragging = false;
      image.style.cursor = "";
    };

    const handleMouseLeave = () => {
      isDragging = false;
      image.style.cursor = "";
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) {
        return;
      }

      const nextX = positionRef.current.x + e.movementX;
      const nextY = positionRef.current.y + e.movementY;
      positionRef.current = clampPosition(nextX, nextY);
      applyTransform();
    };

    positionRef.current = clampPosition(positionRef.current.x, positionRef.current.y);
    applyTransform();

    image.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseleave", handleMouseLeave);
    image.addEventListener("mousemove", handleMouseMove);

    return () => {
      image.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseleave", handleMouseLeave);
      image.removeEventListener("mousemove", handleMouseMove);
    };
  }, [scale]);

  return (
    <div className="relative">
      {isPdf ? (
        <div className="h-dvh w-dvw p-10">
          <iframe src={url} className="h-full w-full" />
        </div>
      ) : (
        <div className="max-h-full max-w-full overflow-hidden" ref={containerRef}>
          <img
            ref={ref}
            src={url}
            draggable={false}
            className={`relative max-h-full max-w-full object-contain select-none ${scale > 1 ? "cursor-grab" : ""}`}
            style={{ transformOrigin: "top left" }}
          />
        </div>
      )}
      <div className="absolute top-0 left-0 flex w-full flex-row justify-between  text-text-muted">
        <div className="flex flex-row gap-2 rounded-br-lg bg-bg-light/70 p-2">
          <button className="block cursor-pointer" onClick={handleZoomIn}>
            <ZoomInIcon />
          </button>
          <button className="cursor-pointer" onClick={handleZoomOut}>
            <ZoomOutIcon />
          </button>
        </div>
        <div className="flex flex-row gap-2 rounded-bl-lg bg-bg-light/70 p-2">
          <button className="cursor-pointer" onClick={onclose}>
            <X />
          </button>
        </div>
      </div>
    </div>
  );
}
