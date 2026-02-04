<template>
  <canvas ref="canvasRef" class="sparks-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const canvasRef = ref(null)
let animationId = null
let resizeHandler = null

onMounted(async () => {
  await nextTick()

  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  let w = 0
  let h = 0
  const sparks = []
  const COUNT = 25

  const createSpark = () => ({
    x: Math.random() * w,
    y: h + Math.random() * 10,
    len: Math.random() * 4 + 2,
    angle: Math.random() * Math.PI,
    vx: (Math.random() - 0.5) * 0.1,
    vy: -Math.random() * 0.5 - 0.2,
    alpha: Math.random() * 0.6 + 0.3,
    fade: Math.random() * 0.008 + 0.004
  })

  const resize = () => {
    const rect = canvas.getBoundingClientRect()
    w = canvas.width = rect.width
    h = canvas.height = rect.height
  }

  resize()
  resizeHandler = resize
  window.addEventListener('resize', resizeHandler)

  // Initialize sparks
  for (let i = 0; i < COUNT; i++) {
    sparks.push(createSpark())
  }

  const draw = () => {
    if (!ctx || w === 0 || h === 0) {
      animationId = requestAnimationFrame(draw)
      return
    }

    ctx.clearRect(0, 0, w, h)

    sparks.forEach(s => {
      s.x += s.vx
      s.y += s.vy
      s.alpha -= s.fade

      if (s.alpha <= 0 || s.y < -10) {
        Object.assign(s, createSpark())
      }

      ctx.save()
      ctx.translate(s.x, s.y)
      ctx.rotate(s.angle)

      ctx.shadowColor = 'rgba(255,120,0,0.7)'
      ctx.shadowBlur = 10

      const g = ctx.createLinearGradient(0, 0, s.len, 0)
      g.addColorStop(0, `rgba(255,220,120,${s.alpha})`)
      g.addColorStop(1, `rgba(255,80,0,0)`)

      ctx.fillStyle = g
      ctx.fillRect(0, 0, s.len, 2)

      ctx.restore()
    })

    animationId = requestAnimationFrame(draw)
  }

  draw()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
})
</script>

<style scoped>
.sparks-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}
</style>
