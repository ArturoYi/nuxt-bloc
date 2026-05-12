<script setup lang="ts">
type RgbTuple = [number, number, number]

type Dot = {
  x: number
  y: number
  phase: number
  drift: number
}

type RenderProfile = {
  densityFactor: number
  frameInterval: number
  minSpacing: number
  pixelRatioCap: number
}

const props = withDefaults(defineProps<{
  density?: number
}>(), {
  density: 1.25,
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
let cleanup: (() => void) | null = null

const FALLBACK_BASE_RGB: RgbTuple = [148, 163, 184]
const FALLBACK_ACCENT_RGB: RgbTuple = [129, 140, 248]

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const mixRgb = (from: RgbTuple, to: RgbTuple, amount: number): RgbTuple => {
  const mix = clamp(amount, 0, 1)

  return [
    Math.round(from[0] + (to[0] - from[0]) * mix),
    Math.round(from[1] + (to[1] - from[1]) * mix),
    Math.round(from[2] + (to[2] - from[2]) * mix),
  ]
}

const readRgbVariable = (name: string, fallback: RgbTuple): RgbTuple => {
  if (!import.meta.client)
    return fallback

  const value = window.getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  const parts = value
    .split(',')
    .map(part => Number.parseInt(part.trim(), 10))
    .filter(part => !Number.isNaN(part))

  if (parts.length !== 3)
    return fallback

  const [red, green, blue] = parts as [number, number, number]

  return [red, green, blue]
}

onBeforeUnmount(() => {
  cleanup?.()
})

onMounted(() => {
  const canvas = canvasRef.value

  if (!canvas)
    return

  const context = canvas.getContext('2d', { alpha: true, desynchronized: true })

  if (!context)
    return

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  const navigatorInfo = navigator as Navigator & {
    connection?: { saveData?: boolean }
    deviceMemory?: number
  }

  let width = 0
  let height = 0
  let dots: Dot[] = []
  let animationFrameId = 0
  let lastRenderTime = 0
  let baseRgb = FALLBACK_BASE_RGB
  let accentRgb = FALLBACK_ACCENT_RGB
  let renderProfile: RenderProfile = {
    densityFactor: 1,
    frameInterval: 1000 / 30,
    minSpacing: 28,
    pixelRatioCap: 1.25,
  }

  const updateColors = () => {
    baseRgb = readRgbVariable('--art-dots-rgb', FALLBACK_BASE_RGB)
    accentRgb = readRgbVariable('--art-dots-accent-rgb', FALLBACK_ACCENT_RGB)
  }

  const updateRenderProfile = () => {
    const lowCpu = navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4
    const lowMemory = typeof navigatorInfo.deviceMemory === 'number' && navigatorInfo.deviceMemory <= 4
    const saveData = navigatorInfo.connection?.saveData === true
    const compactViewport = window.innerWidth < 768
    const lowPowerMode = lowCpu || lowMemory || saveData || compactViewport

    renderProfile = lowPowerMode
      ? {
          densityFactor: 0.82,
          frameInterval: 1000 / 24,
          minSpacing: 32,
          pixelRatioCap: 1,
        }
      : {
          densityFactor: 1,
          frameInterval: 1000 / 30,
          minSpacing: 28,
          pixelRatioCap: 1.25,
        }
  }

  const createDots = () => {
    const baseSpacing = width < 640 ? 30 : width < 1080 ? 36 : 42
    // density 越大，spacing 越小，粒子数量会更密。
    const density = clamp(props.density * renderProfile.densityFactor, 0.45, 1.8)
    const spacing = clamp(baseSpacing / Math.sqrt(density), renderProfile.minSpacing, 52)
    const nextDots: Dot[] = []

    for (let y = spacing / 2; y < height + spacing; y += spacing) {
      for (let x = spacing / 2; x < width + spacing; x += spacing) {
        nextDots.push({
          x,
          y,
          phase: Math.random() * Math.PI * 2,
          drift: 0.6 + Math.random() * 0.9,
        })
      }
    }

    dots = nextDots
  }

  const resizeCanvas = () => {
    width = window.innerWidth
    height = window.innerHeight

    updateRenderProfile()

    const devicePixelRatio = Math.min(window.devicePixelRatio || 1, renderProfile.pixelRatioCap)

    canvas.width = Math.round(width * devicePixelRatio)
    canvas.height = Math.round(height * devicePixelRatio)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)

    createDots()
  }

  const drawFrame = (time: number) => {
    context.clearRect(0, 0, width, height)

    const timeFactor = time * 0.001

    for (const dot of dots) {
      const phase = timeFactor * dot.drift + dot.phase
      const wave = 0.5 + 0.5 * Math.sin(phase + dot.x * 0.01 + dot.y * 0.006)
      const color = mixRgb(baseRgb, accentRgb, 0.22 + wave * 0.26)
      const alpha = clamp(0.14 + wave * 0.18, 0.12, 0.32)
      const radius = 0.95 + wave * 0.3
      const offsetX = Math.sin(phase) * 0.24
      const offsetY = Math.cos(phase * 0.92) * 0.2

      context.beginPath()
      context.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`
      context.arc(dot.x + offsetX, dot.y + offsetY, radius, 0, Math.PI * 2)
      context.fill()
    }
  }

  const renderStatic = () => drawFrame(0)
  const handleResize = () => {
    resizeCanvas()

    if (reducedMotionQuery.matches)
      renderStatic()
  }

  const animate = (time: number) => {
    if (!lastRenderTime || time - lastRenderTime >= renderProfile.frameInterval) {
      drawFrame(time)
      lastRenderTime = time
    }

    animationFrameId = window.requestAnimationFrame(animate)
  }

  const handleVisibilityChange = () => {
    window.cancelAnimationFrame(animationFrameId)
    lastRenderTime = 0

    if (!document.hidden && !reducedMotionQuery.matches)
      animationFrameId = window.requestAnimationFrame(animate)
  }

  const handleMotionPreferenceChange = () => {
    window.cancelAnimationFrame(animationFrameId)
    lastRenderTime = 0

    if (reducedMotionQuery.matches)
      renderStatic()
    else
      animationFrameId = window.requestAnimationFrame(animate)
  }

  const themeObserver = new MutationObserver(() => {
    updateColors()
    renderStatic()
  })
  const stopDensityWatch = watch(() => props.density, () => {
    createDots()

    if (reducedMotionQuery.matches)
      renderStatic()
  })

  updateColors()
  handleResize()

  if (reducedMotionQuery.matches)
    renderStatic()
  else
    animationFrameId = window.requestAnimationFrame(animate)

  window.addEventListener('resize', handleResize)
  document.addEventListener('visibilitychange', handleVisibilityChange)
  reducedMotionQuery.addEventListener('change', handleMotionPreferenceChange)
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })

  cleanup = () => {
    window.cancelAnimationFrame(animationFrameId)
    window.removeEventListener('resize', handleResize)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    reducedMotionQuery.removeEventListener('change', handleMotionPreferenceChange)
    themeObserver.disconnect()
    stopDensityWatch()
    cleanup = null
  }
})
</script>

<template>
  <div class="art-dots" aria-hidden="true">
    <canvas ref="canvasRef" class="art-dots__canvas" />
  </div>
</template>
