// utils/pageAnimation.ts
import { gsap } from "gsap";

// Type Definitions
type AnimationDirection = "right" | "left";

interface TimelineConfig {
  onComplete?: () => void;
}

/**
 * Handles the transition animation between pages with directional exit and entrance.
 * @param {AnimationDirection} direction - Direction of animation: "right" or "left"
 * @param {() => void} callback - Callback function to execute during the transition (typically navigation)
 */
export const animatePageTransition = (
  direction: AnimationDirection,
  callback?: () => void
): void => {
  // Get the current page container
  const currentPage: Element | null = document.querySelector(".page-container");

  if (!currentPage) {
    console.warn("Page container element not found");
    return;
  }

  // Create a timeline for the exit animation
  const tl: gsap.core.Timeline = gsap.timeline({
    onComplete: (): void => {
      // Execute the callback (navigation) after the exit animation
      if (callback) {
        callback();
      }

      // After navigation occurs, run the entrance animation
      // This will be triggered when the new page mounts
      gsap.fromTo(
        ".page-container",
        {
          x: direction === "right" ? "100%" : "-100%",
          opacity: 0,
        },
        {
          x: "0%",
          opacity: 1,
          duration: 0.5,
          ease: "power2.inOut",
        }
      );
    },
  });

  // Exit animation
  tl.to(currentPage, {
    x: direction === "right" ? "-100%" : "100%",
    opacity: 0,
    duration: 0.5,
    ease: "power2.inOut",
  });
};

/**
 * Sets up the initial state for a page that's about to enter.
 * This should be called in the useEffect of each page component.
 */
export const setupPageEnter = (): void => {
  gsap.set(".page-container", { opacity: 1, x: "0%" });
};
