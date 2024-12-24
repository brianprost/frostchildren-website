<script>
  import { onMount, onDestroy } from "svelte";

  // Add a prop for the image path
  export let imagePath;
  export let imageWidth;
  export let imageHeight;

  let containerRef;
  let dvdLogo;
  let animationFrameId;

  // Logo properties
  let x = 0;
  let y = 0;
  let dx = 1;
  let dy = 1;
  let logoWidth = imageWidth;
  let logoHeight = imageHeight;

  // Animation state
  let isAnimating = false;

  function checkCornerHit(x, y, containerWidth, containerHeight) {
    const corners = [
      { x: 0, y: 0 },
      { x: containerWidth - logoWidth, y: 0 },
      { x: 0, y: containerHeight - logoHeight },
      { x: containerWidth - logoWidth, y: containerHeight - logoHeight },
    ];

    return corners.some(
      (corner) => Math.abs(x - corner.x) < 1 && Math.abs(y - corner.y) < 1
    );
  }

  function animate() {
    if (!containerRef || !isAnimating) return;

    const containerWidth = containerRef.clientWidth;
    const containerHeight = containerRef.clientHeight;

    // Update position
    x += dx;
    y += dy;

    // Check for collisions with container boundaries
    if (x <= 0 || x + logoWidth >= containerWidth) {
      dx = -dx;
      x = Math.max(0, Math.min(x, containerWidth - logoWidth));
    }

    if (y <= 0 || y + logoHeight >= containerHeight) {
      dy = -dy;
      y = Math.max(0, Math.min(y, containerHeight - logoHeight));
    }

    // Check for corner hits
    if (checkCornerHit(x, y, containerWidth, containerHeight)) {
      alert("Abrys hit a corner, btw! 🎉");
    }

    // Update logo position
    if (dvdLogo) {
      dvdLogo.style.transform = `translate(${x}px, ${y}px)`;
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  onMount(() => {
    isAnimating = true;
    animate();
  });

  onDestroy(() => {
    isAnimating = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  });
</script>

<div
  class="relative border border-gray-700 min-w-full h-96 overflow-hidden"
  bind:this={containerRef}
>
  <img
    bind:this={dvdLogo}
    src={imagePath}
    alt="Bouncing Logo"
    class="absolute"
    style="width: {logoWidth}px; height: {logoHeight}px; object-fit: contain;"
  />
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }
</style>
