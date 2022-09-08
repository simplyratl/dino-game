import { randomNumberBetween } from "../cactus.js"
import { getCustomProperty, incrementCustomProperty, setCustomProperty } from "../updateCustomProperty.js"

const SPEED = 0.002
const CLOUD_INTERVAL_MIN = 200
const CLOUD_INTERVAL_MAX = 6000

const CLOUD_HEIGHT_MIN = 10
const CLOUD_HEIGHT_MAX = 20

const worldElement = document.querySelector("[data-world]")

let nextCloudtime

export function setupClouds() {
  nextCloudtime = CLOUD_INTERVAL_MIN
  document.querySelectorAll("[data-cloud]").forEach((cloud) => cloud.remove())
}

export function updateClouds(delta, speedScale) {
  document.querySelectorAll("[data-cloud]").forEach((cloud) => {
    incrementCustomProperty(cloud, "--left", delta * speedScale * SPEED * -1)

    if (getCustomProperty(cloud, "--left") <= -100) {
      cloud.remove()
    }
  })

  if (nextCloudtime <= 0) {
    createCloud()
    nextCloudtime = randomNumberBetween(CLOUD_INTERVAL_MIN, CLOUD_INTERVAL_MAX) / speedScale
  }

  nextCloudtime -= delta / 6
}

function createCloud() {
  const cloud = document.createElement("img")
  cloud.src = "./images/clouds.png"
  cloud.dataset.cloud = true
  cloud.classList.add("cloud")

  setCustomProperty(cloud, "--left", 100)
  setCustomProperty(cloud, "--top", randomNumberBetween(20, 50))
  setCustomProperty(cloud, "--height", randomNumberBetween(CLOUD_HEIGHT_MIN, CLOUD_HEIGHT_MAX))
  worldElement.append(cloud)
}
