import { randomNumberBetween } from "./cactus.js"
import { getCustomProperty, incrementCustomProperty, setCustomProperty } from "./updateCustomProperty.js"

const SPEED = 0.06
const BIRD_INTERVAL_MIN = 8000
const BIRD_INTERVAL_MAX = 20000
const BIRD_FRAME_COUNT = 2
const FRAME_TIME = 160
const worldElement = document.querySelector("[data-world]")

let nextBirdTime
let birdFrame
let currentFrameTime

export function setupBird() {
  nextBirdTime = BIRD_INTERVAL_MIN
  birdFrame = 0
  currentFrameTime = 0
  document.querySelectorAll("[data-bird]").forEach((bird) => bird.remove())
}

export function updateBird(delta, speedScale) {
  document.querySelectorAll("[data-bird]").forEach((bird) => {
    incrementCustomProperty(bird, "--left", delta * speedScale * SPEED * -1)

    if (getCustomProperty(bird, "--left") <= -100) {
      bird.remove()
    }
  })

  if (document.querySelector("[data-bird]")) {
    handleFly(delta, speedScale, document.querySelector("[data-bird]"))
  }

  if (nextBirdTime <= 0) {
    createBird()
    nextBirdTime = randomNumberBetween(BIRD_INTERVAL_MIN, BIRD_INTERVAL_MAX)
  }

  nextBirdTime -= delta
}

function createBird() {
  const bird = document.createElement("img")
  bird.dataset.bird = true
  bird.classList.add("bird")
  setCustomProperty(bird, "--left", 100)

  bird.src = `./images/bird-fly-0.png`

  worldElement.append(bird)
}

export function getBirdRects() {
  return [...document.querySelectorAll("[data-bird]")].map((bird) => {
    return bird.getBoundingClientRect()
  })
}

function handleFly(delta, speedScale, bird) {
  if (currentFrameTime >= FRAME_TIME) {
    birdFrame = (birdFrame + 1) % BIRD_FRAME_COUNT
    bird.src = `./images/bird-fly-${birdFrame}.png`
    currentFrameTime -= FRAME_TIME
  }

  currentFrameTime += delta * speedScale
}
