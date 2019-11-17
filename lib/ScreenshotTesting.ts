import { writeFileSync, existsSync, readFileSync } from 'fs'
import mkdirp from 'mkdirp'
import jimp from 'jimp'
import { dirname } from 'path'
import { getCurrentContext } from 'prescript'

export async function compareScreenshots(title: string, image: Buffer) {
  const baselinePath = `screenshots/baseline/${title}.png`
  const checkpointPath = `screenshots/checkpoint/${title}.png`
  mkdirp.sync(dirname(baselinePath))
  mkdirp.sync(dirname(checkpointPath))
  if (!existsSync(baselinePath)) {
    writeFileSync(baselinePath, image)
  }
  writeFileSync(checkpointPath, image)
  const baseline = await jimp.read(baselinePath)
  const checkpoint = await jimp.read(checkpointPath)
  if (areImagesDifferent(baseline, checkpoint)) {
    getCurrentContext().attach(
      'Baseline',
      readFileSync(baselinePath),
      'image/png',
    )
    getCurrentContext().attach(
      'Checkpoint',
      readFileSync(checkpointPath),
      'image/png',
    )
    throw new Error(
      `Screenshot "${checkpointPath}" has changed. ` +
        `If it is correct, please replace the baseline image with the checkpoint image.`,
    )
  }
}

const areImagesDifferent = (a: any, b: any) => {
  if (a.bitmap.width !== b.bitmap.width) return true
  if (a.bitmap.height !== b.bitmap.height) return true
  const diff = jimp.diff(a, b)
  const threshold = 0.001
  return diff.percent > threshold
}
