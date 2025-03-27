<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Github } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'
import { config } from '@/data/config'

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  speed: number
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
const stars = ref<Star[]>([])
const mousePosition = ref({ x: 0, y: 0 })

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const setCanvasSize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  const initStars = () => {
    stars.value = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3,
      opacity: Math.random() * 0.5 + 0.2,
      speed: Math.random() * 0.4 + 0.1,
    }))
  }

  const animate = () => {
    if (!ctx || !canvas) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const isDarkMode = document.documentElement.classList.contains('dark')

    stars.value.forEach((star) => {
      star.y += star.speed
      if (star.y > canvas.height) {
        star.y = 0
        star.x = Math.random() * canvas.width
      }

      const dx = star.x - mousePosition.value.x
      const dy = star.y - mousePosition.value.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const maxDistance = 100

      if (distance < maxDistance) {
        const angle = Math.atan2(dy, dx)
        const push = (1 - distance / maxDistance) * 2
        star.x += Math.cos(angle) * push
        star.y += Math.sin(angle) * push
      }

      ctx.fillStyle = isDarkMode
        ? `rgba(255, 255, 255, ${star.opacity})`
        : `rgba(0, 0, 0, ${star.opacity * 0.7})`

      ctx.beginPath()
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
      ctx.fill()
    })

    requestAnimationFrame(animate)
  }

  const handleMouseMove = (e: MouseEvent) => {
    mousePosition.value = {
      x: e.clientX,
      y: e.clientY,
    }
  }

  const handleResize = () => {
    setCanvasSize()
    initStars()
  }

  setCanvasSize()
  initStars()
  animate()

  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('resize', handleResize)

  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('resize', handleResize)
  })
})
</script>

<template>
  <div class="relative min-h-screen">
    <canvas
      ref="canvasRef"
      class="absolute inset-0 z-0"
      :style="{ background: 'transparent' }"
    ></canvas>
    <div class="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <img
        :src="config.favicon"
        :alt="config.author"
        class="mb-8 h-48 w-48 rounded-full border-4 border-primary object-cover shadow-lg"
      />
      <h1 class="mb-4 text-4xl font-bold tracking-tight sm:text-6xl">
        {{ config.author }}
      </h1>
      <p class="mb-6 text-xl text-muted-foreground sm:text-2xl">
        {{ config.title }}
      </p>
      <p class="mb-8 max-w-2xl text-muted-foreground">
        {{ config.description }}
      </p>
      <div class="mb-12 flex space-x-4">
        <div class="relative group">
          <Button variant="outline" size="lg" class="rounded-full px-3" aria-label="Github">
            <a
              :href="config.social.github"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github/>
            </a>
          </Button>
          <span class="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded-md shadow-md">
            Github
          </span>
        </div>
        <Button asChild variant="default" size="lg" class="rounded-full">
          <a
            :href="config.social.linkedin"
            target="_blank"
            rel="noopener noreferrer"
          >               
            LinkedIn
          </a>
        </Button>
        <div class="relative group">
          <!-- <Button variant="outline" size="icon" class="rounded-full group-hover:tooltip" aria-label="Mail">
            <a
              href={`mailto:${heroData.contact.email}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Mail class="h-5 w-5" />
            </a>
          </Button> -->
          <span class="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded-md shadow-md">
            email
          </span>
        </div>
      </div>
      <div class="mb-4 flex flex-wrap gap-2">
        <Badge
          v-for="skill in config.skills"
          :key="skill"
          variant="secondary"
          class="text-sm"
        >
          {{ skill }}
        </Badge>
      </div>
    </div>
  </div>
</template>