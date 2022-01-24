import fs from 'graceful-fs'
import path from 'path'

const { statSync, mkdirSync } = fs

const assetDir = path.join(process.cwd(), 'public', '.nextra')
const asset: { [locale: string]: any } = {}

try {
  statSync(assetDir)
} catch (err) {
  mkdirSync(assetDir)
}

export async function addPage({
  fileLocale,
  route,
  title,
  data,
  structurizedData
}: {
  fileLocale: string
  route: string
  title: string
  data: any
  structurizedData: any
}) {
  if (!asset[fileLocale]) {
    asset[fileLocale] = {}
  }
  asset[fileLocale][route] = {
    title: title || data.title,
    data: structurizedData
  }
  const dataFile = path.join(assetDir, `data-${fileLocale}.json`)
  // To prevent race conditions, we temporarily use the sync method to flush.
  // @TODO: introduce mutex lock, or only generate the asset when finishing the
  // entire build.
  fs.writeFileSync(dataFile, JSON.stringify(asset[fileLocale]))
}
