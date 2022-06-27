import type { Spline } from '@curvy/types'
import type p5 from 'p5'

interface Point {
  x: number
  y: number
}
interface SketchThunkOpts {
  spline: Spline
  points: Point[]
  numSamples: number
  doMapToCanvas?: boolean
  doSpaceEvenly?: boolean
  emit?: Function
}
export default ({
  spline,
  points,
  numSamples,
  doMapToCanvas,
  doSpaceEvenly,
  emit,
}: SketchThunkOpts) =>
  function (p: p5) {
    let maxX = 500
    let maxY = 500
    const canvasPadding = 64
    const axesPosition = {
      x: {
        min: 0,
        max: 500,
      },
      y: {
        min: 0,
        max: 500,
      },
    }

    const draggingPoint = {
      index: -1,
      isDragging: false,
    }

    const bounds = () => ({
      x: {
        min: doSpaceEvenly
          ? Math.min(spline.meta.bounds.x.min, spline.meta.bounds.y.min)
          : spline.meta.bounds.x.min,
        max: doSpaceEvenly
          ? Math.max(spline.meta.bounds.x.max, spline.meta.bounds.y.max)
          : spline.meta.bounds.x.max,
      },
      y: {
        min: doSpaceEvenly
          ? Math.min(spline.meta.bounds.x.min, spline.meta.bounds.y.min)
          : spline.meta.bounds.y.min,
        max: doSpaceEvenly
          ? Math.max(spline.meta.bounds.x.max, spline.meta.bounds.y.max)
          : spline.meta.bounds.y.max,
      },
    })

    function sizeContainer() {
      const container = document.getElementById('sketch')
      const containerBoundingRect = container?.getBoundingClientRect()
      const minDimension = Math.min(
        containerBoundingRect?.width ?? 500,
        containerBoundingRect?.height ?? 500
      )
      maxX = minDimension
      maxY = minDimension
    }

    function reset() {
      p.background(255)
      drawGraph(points)
    }

    p.setup = function () {
      sizeContainer()
      const canvas = p.createCanvas(maxX, maxY)
      axesPosition.x.max = p.width
      axesPosition.y.max = p.height
      canvas.parent('sketch')
      canvas.class('m-auto border-2 border-gray-200 bg-white')
      p.textAlign(p.CENTER, p.CENTER)
      translateCoordinateSystem()
      p.background(255)
      drawGraph(points)
    }

    p.windowResized = function () {
      let maxXBefore = maxX
      let maxYBefore = maxY
      sizeContainer()
      if (maxX !== maxXBefore || maxY != maxYBefore) {
        setTimeout(() => {
          p.resizeCanvas(maxX, maxY)
          drawGraph(points)
          axesPosition.x.max = p.width
          axesPosition.y.max = p.height
        })
      }
    }

    function createSampledPoints() {
      const res: Point[] = []
      const numPoints = Math.max(points.length, numSamples)
      for (let i = 0; i < numPoints; i++) {
        const x = p.map(i, 0, numPoints, bounds().x.min, bounds().x.max)
        const y = spline.solveY(x)
        res.push({ x, y: y! })
      }
      return res
    }

    function getX(x: number) {
      return doMapToCanvas
        ? p.map(
            x,
            bounds().x.min,
            bounds().x.max,
            -p.width / 2 + canvasPadding / 2,
            p.width / 2 - canvasPadding / 2
          )
        : x
    }
    function getY(y: number) {
      return doMapToCanvas
        ? p.map(
            y,
            bounds().y.min,
            bounds().y.max,
            -p.height / 2 + canvasPadding / 2,
            p.height / 2 - canvasPadding / 2
          )
        : y
    }

    function drawLines(points: Point[], strokeWeight = 3) {
      p.stroke(0, 100)
      p.strokeWeight(strokeWeight)
      p.beginShape()
      p.noFill()
      points.forEach(({ x, y }) => {
        p.vertex(getX(x), getY(y))
      })
      p.endShape()
    }

    function drawPoints(points: Point[], radius = 10) {
      p.stroke(0, 100)
      p.fill(30, 40, 200)
      p.strokeWeight(1)
      points.forEach(({ x, y }) => {
        p.ellipse(getX(x), getY(y), radius, radius)
      })
    }

    p.mousePressed = function () {
      const radius = 10
      if (!emit) {
        return
      }
      const mouseX = p.mouseX - p.width / 2
      const mouseY = p.height / 2 - p.mouseY
      points.forEach(({ x, y }, i) => {
        if (Math.abs(mouseX - getX(x)) < radius && Math.abs(mouseY - getY(y)) < radius) {
          emit('update:mouseIsOver', [i, true])
          if(p.keyIsDown(16)) {
            draggingPoint.index = i
            draggingPoint.isDragging = true
          }
        } else {
          emit('update:mouseIsOver', [i, false])
        }
      })
    }
    p.mouseReleased = function() {
      const xMin = doMapToCanvas ? bounds().x.min : -p.width/2
      const xMax = doMapToCanvas ? bounds().x.max : p.width/2
      const yMin = doMapToCanvas ? bounds().y.min : -p.height/2
      const yMax = doMapToCanvas ? bounds().y.max : p.height/2
      const yOffSet = doMapToCanvas ? yMax : 0
      const mappedMouse = {
        x: Math.round(p.map(p.mouseX, 0, p.width, xMin, xMax)),
        y: Math.round(-p.map(p.mouseY, 0, p.height, yMin, yMax) + yOffSet),
      }
      if(draggingPoint.isDragging) {
        const newVal = points.map(({ x, y }) => [x, y])
        newVal[draggingPoint.index] = [mappedMouse.x, mappedMouse.y]
        emit!('update:updatePoints', newVal)
      }
      draggingPoint.index = -1
      draggingPoint.isDragging = false
    }

    function drawAxes(strokeWeight = 2) {
      p.stroke(200)
      p.strokeWeight(strokeWeight)
      p.beginShape(p.LINES)
      p.vertex((-axesPosition.x.max / 2), getY(0))
      p.vertex((axesPosition.x.max / 2), getY(0))
      p.vertex(getX(0), (-axesPosition.y.max / 2))
      p.vertex(getX(0), (axesPosition.y.max / 2))
      p.endShape()
    }

    function drawGridLines(strokeWeight = 1, spacing = 50, labelFrequency = 2) {
      const numLines = {
        x: Math.floor(p.height / spacing),
        y: Math.floor(p.width / spacing),
      }
      p.stroke(245)
      p.strokeWeight(strokeWeight)
      p.beginShape(p.LINES)
      for (let i = 0; i <= numLines.x; i++) {
        const yCoord = p.map(i * spacing + getY(0), 0 + getY(0), numLines.x * spacing + getY(0), bounds().y.min, bounds().y.max)
        const y = getY(yCoord)
        p.vertex(getX(-axesPosition.x.max / 2), y)
        p.vertex(getX(axesPosition.x.max / 2), y)
        if (i % labelFrequency === 1) {
          p.push()
          p.translate(-axesPosition.x.max / 2 + canvasPadding / 4, y)
          p.scale(1, -1)
            p.textSize(12)
            p.text(Math.floor(yCoord).toString(), 0, 0)
            p.pop()
        }
      }
      for (let i = 0; i <= numLines.x; i++) {
        const xCoord = p.map(i * spacing + getX(0), getX(0), numLines.y * spacing + getX(0), bounds().x.min, bounds().x.max)
        const x = getX(xCoord)
        p.vertex(x, getY(-axesPosition.y.max / 2))
        p.vertex(x, getY(axesPosition.y.max / 2))
        if (i % labelFrequency === 1) {
        p.push()
        p.scale(1, -1)
          p.textSize(12)
          p.text(Math.floor(xCoord).toString(), x, axesPosition.y.max / 2 - canvasPadding / 4)
          p.pop()
        }
      }
      p.endShape()
    }

    function drawGraph(points: Point[]) {
      drawGridLines()
      drawAxes()
      drawLines(createSampledPoints())
      drawPoints(points)
    }

    function translateCoordinateSystem() {
      p.translate(p.width / 2, p.height / 2)
      p.scale(1, -1)
    }

    window.addEventListener('resetsketch', (e: any) => {
      console.log('SHOULD RESET', e)
      points = e.detail.points
      spline = e.detail.spline
      numSamples = e.detail.numSamples
      doMapToCanvas = e.detail.doMapToCanvas
      doSpaceEvenly = e.detail.doSpaceEvenly
      reset()
    })
  }
