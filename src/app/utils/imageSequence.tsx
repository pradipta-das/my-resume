import gsap from "gsap";

export interface ImageSequenceConfig {
  canvas: string | HTMLCanvasElement;
  urls: string[];
  fps?: number;
  paused?: boolean;
  clear?: boolean;
  scrollTrigger?: gsap.DOMTarget | object;
  onUpdate?: (currentFrame: number, activeImage: HTMLImageElement) => void;
  onImageLoad?: (loadedCount: number, totalCount: number) => void; // Opt-in callback for preloader hooks
}

interface Playhead {
  frame: number;
}

export function imageSequence(config: ImageSequenceConfig): gsap.core.Tween | null {
  if (typeof window === "undefined") return null;

  const playhead: Playhead = { frame: 0 };
  let canvas: HTMLCanvasElement | null = typeof config.canvas === "string" 
    ? document.querySelector(config.canvas) 
    : config.canvas;

  if (!canvas) {
    console.warn("GSAP ImageSequence Error: Target Canvas Element not found.");
    return null;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  let curFrame = -1;
  const totalFrames = config.urls.length;
  let loadedCount = 0;

  const updateImage = () => {
    let frame = Math.round(playhead.frame);
    if (frame < 0) frame = 0;
    if (frame >= totalFrames) frame = totalFrames - 1;

    if (frame !== curFrame) {
      const activeImg = images[frame];
      // Delegate actual drawing to the caller via onUpdate so
      // consumers (like BlendedHomepage) can composite/mix frames
      // and apply custom drawing logic (alpha, cropping, etc.).
      curFrame = frame;
      if (config.onUpdate) {
        config.onUpdate(frame, activeImg);
      }
    }
  };

  const images: HTMLImageElement[] = config.urls.map((url, i) => {
    const img = new Image();
    img.src = url;
    
    const handleLoad = () => {
      loadedCount++;
      if (config.onImageLoad) {
        config.onImageLoad(loadedCount, totalFrames);
      }
      // When all frames have loaded, ensure we render the current
      // playhead frame at least once so consumers can show the
      // initial image immediately (even if the tween is paused).
      if (loadedCount === totalFrames) {
        updateImage();
      }
    };

    img.onload = handleLoad;
    img.onerror = handleLoad; // Fallback anchor prevents layout hang-ups
    return img;
  });

  return gsap.to(playhead, {
    frame: totalFrames - 1,
    ease: "none",
    onUpdate: updateImage,
    duration: totalFrames / (config.fps || 30),
    paused: !!config.paused,
    scrollTrigger: config.scrollTrigger
  });
}
