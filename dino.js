import { getCustomProperty, incrementCustomProperty, setCustomProperty } from "./updateCustomProperty.js"

const dinoElement = document.querySelector("[data-dino]")
const JUMP_SPPEED = 0.45
const GRAVITY = 0.0015
const DINO_FRAME_COUNT = 2
const FRAME_TIME = 100

let isJumping
let dinoFrame
let currentFrameTime
let yVelocity
let isDucking

export function setupDino() {
  isJumping = false
  isDucking = false
  dinoFrame = 0
  currentFrameTime = 0
  yVelocity = 0

  setCustomProperty(dinoElement, "--bottom", 0)
  document.removeEventListener("keydown", handleInput)
  document.addEventListener("keydown", handleInput)

  document.removeEventListener("keyup", stopDucking)
  document.addEventListener("keyup", stopDucking)
}

export function updateDino(delta, speedScale) {
  handleRun(delta, speedScale)
  handleJump(delta)
}

export function setDinoLose() {
  dinoElement.src = "./images/dino-lose.png"
}

function handleRun(delta, speedScale) {
  if (isJumping) {
    dinoElement.src = "./images/dino-stationary.png"
    return
  }

  if (currentFrameTime >= FRAME_TIME) {
    dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT

    if (!isDucking) {
      dinoElement.src = `./images/dino-run-${dinoFrame}.png`
    } else {
      dinoElement.src = `./images/dino-duck-${dinoFrame}.png`
    }

    currentFrameTime -= FRAME_TIME
  }

  currentFrameTime += delta * speedScale
}

export function getDinoRects() {
  return dinoElement.getBoundingClientRect()
}

function handleInput(e) {
  if (e.code === "Space" || e.key === "ArrowUp") return onJump(e)
  if (e.code === "ArrowDown") return onDuck(e)
}

function handleJump(delta) {
  if (!isJumping) return

  incrementCustomProperty(dinoElement, "--bottom", yVelocity * delta)

  if (getCustomProperty(dinoElement, "--bottom") <= 0) {
    setCustomProperty(dinoElement, "--bottom", 0)
    isJumping = false
  }

  yVelocity -= GRAVITY * delta
}

function onJump(e) {
  if (isJumping) return

  yVelocity = JUMP_SPPEED
  isJumping = true
}

function onDuck(e) {
  if (e.code !== "ArrowDown" && isDucking) return (isDucking = false)

  if (isJumping) {
    yVelocity -= 0.22
    return
  }

  startDucking()
}

function startDucking() {
  setCustomProperty(dinoElement, "--bottom", -10)

  isDucking = true
}

function stopDucking() {
  if (!isDucking && isJumping) return
  setCustomProperty(dinoElement, "--bottom", 0)
  isDucking = false
}
