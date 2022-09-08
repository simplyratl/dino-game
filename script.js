import { setupGround, updateGround } from "./ground.js"
import { getDinoRects, setDinoLose, setupDino, updateDino } from "./dino.js"
import { getCactusRects, setupCactus, updateCactus } from "./cactus.js"
import { getBirdRects, setupBird, updateBird } from "./bird.js"
import { setupClouds, updateClouds } from "./environment/clouds.js"

const WORLD_WIDTH = 150
const WORLD_HEIGHT = 40
let SPEED_SCALE = 1
const SPEED_SCALE_INCREASE = 0.00001

let score = 0

let isPlaying = false

const worldElement = document.querySelector("[data-world]")
const scoreElement = document.querySelector("[data-score]")
const startScreenElement = document.querySelector("[data-start-screen]")

setPixelToWorldScale()
displayHighScore()

window.addEventListener("resize", setPixelToWorldScale)
document.addEventListener("keydown", handleStart)

let lastTime

function update(time) {
  if (lastTime == null) {
    lastTime = time
    window.requestAnimationFrame(update)
    return
  }
  const delta = time - lastTime

  updateSpeedScale(delta)
  updateGround(delta, SPEED_SCALE)
  updateDino(delta, SPEED_SCALE)
  updateCactus(delta, SPEED_SCALE, score)
  if (score >= 500) {
    updateBird(delta, SPEED_SCALE)
  }
  updateClouds(delta, SPEED_SCALE)
  updateScore(delta)

  if (checkLose()) return handleLose()

  lastTime = time
  window.requestAnimationFrame(update)
}

function checkLose() {
  const dinoRect = getDinoRects()
  return (
    getCactusRects().some((rect) => isCollision(rect, dinoRect)) ||
    getBirdRects().some((rect) => isCollision(rect, dinoRect))
  )
}

function isCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top
  )
}

function updateSpeedScale(delta) {
  SPEED_SCALE += delta * SPEED_SCALE_INCREASE
}

function updateScore(delta) {
  score += delta * 0.01

  scoreElement.textContent = String(Math.floor(score)).padStart(5, "0")
}

function handleStart(e) {
  if (e.code !== "Space") return

  if (isPlaying) return

  isPlaying = true
  lastTime = null
  SPEED_SCALE = 1
  score = 0
  setupGround()
  setupDino()
  setupCactus()
  setupBird()

  setupClouds()
  startScreenElement.classList.add("hide")
  window.requestAnimationFrame(update)
}

function handleLose() {
  isPlaying = false
  setDinoLose()
  displayHighScore()

  setTimeout(() => {
    document.addEventListener("keydown", handleStart)
    startScreenElement.classList.remove("hide")
  }, 100)
}

function displayHighScore() {
  const highscoreEL = document.querySelector("[data-high-score]")

  if (localStorage.getItem("highscore") == null) {
    localStorage.setItem("highscore", 0)
  }

  let highscore = parseInt(localStorage.getItem("highscore"))

  if (parseInt(score) > highscore) {
    localStorage.setItem("highscore", score)
  }

  highscoreEL.textContent = `HI ${String(highscore).padStart(5, "0")}`
}

function setPixelToWorldScale() {
  let worldToPixelScale

  if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
    worldToPixelScale = window.innerWidth / WORLD_WIDTH
  } else {
    worldToPixelScale = window.innerHeight / WORLD_HEIGHT
  }

  worldElement.style.width = `${WORLD_WIDTH * worldToPixelScale}px`
  worldElement.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`
}
