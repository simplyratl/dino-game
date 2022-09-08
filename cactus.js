import { getCustomProperty, incrementCustomProperty, setCustomProperty } from "./updateCustomProperty.js"

const SPEED = 0.05
const CACTUS_INTERVAL_MIN = 800
const CACTUS_INTERVAL_MAX = 2000
const worldElement = document.querySelector("[data-world]")

const CACTUS_HEIGHT_MIN = 20
const CACTUS_HEIGHT_MAX = 30

let nextCactusTime

export function setupCactus() {
  nextCactusTime = CACTUS_INTERVAL_MIN
  document.querySelectorAll("[data-cactus]").forEach((cactus) => cactus.remove())
}

export function updateCactus(delta, speedScale, score) {
  document.querySelectorAll("[data-cactus]").forEach((cactus) => {
    incrementCustomProperty(cactus, "--left", delta * speedScale * SPEED * -1)

    if (getCustomProperty(cactus, "--left") <= -100) {
      cactus.remove()
    }
  })

  if (nextCactusTime <= 0) {
    createCactus(score)
    nextCactusTime = randomNumberBetween(CACTUS_INTERVAL_MIN, CACTUS_INTERVAL_MAX) / speedScale
  }

  nextCactusTime -= delta
}

function createCactus(score) {
  const cactusSprite = Math.random() > 0.8 && score >= 500 ? "./images/cactus-row.png" : "./images/cactus.png"

  const cactus = document.createElement("img")
  cactus.dataset.cactus = true

  cactus.src = cactusSprite
  cactus.classList.add("cactus")
  setCustomProperty(cactus, "--left", 100)
  worldElement.append(cactus)
  setCustomProperty(cactus, "--height", randomNumberBetween(CACTUS_HEIGHT_MIN, CACTUS_HEIGHT_MAX))
}

export function getCactusRects() {
  return [...document.querySelectorAll("[data-cactus]")].map((cactus) => {
    return cactus.getBoundingClientRect()
  })
}

export function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min - 1) + min)
}
