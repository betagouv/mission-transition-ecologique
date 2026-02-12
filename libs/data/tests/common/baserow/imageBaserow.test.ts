import { describe, test, expect, beforeEach, vi, afterEach, Mock } from 'vitest'
import path from 'path'

// System under test
import { ImageBaserow } from '../../../src/common/baserow/imageBaserow'
import type { ImageTable, LinkObject, Image } from '../../../src/common/baserow/types'

// Mocks
vi.mock('axios', () => ({
  default: {
    get: vi.fn()
  }
}))
import axios from 'axios'

// Override ConfigBaserow for tests only (no dependency on env variables)
// Mock the real module so that any ConfigBaserow reads use these neutral values.
vi.mock('../../../src/config/configBaserow', () => ({
  default: {
    TOKEN: 'TEST_TOKEN',
    THEME_ID: 0,
    OPERATOR_ID: 0,
    GEOGRAPHIC_AREAS_ID: 0,
    PROJECT_ID: 0,
    IMAGE_ID: 1
  }
}))

// sharp is a function returning a chainable object
const mockToBuffer = vi.fn()
const mockWebp = vi.fn(() => ({ toBuffer: mockToBuffer }))
const mockResize = vi.fn(() => ({ webp: mockWebp }))
const mockMetadata = vi.fn()
const mockSharpInstance = { metadata: mockMetadata, resize: mockResize, webp: mockWebp, toBuffer: mockToBuffer }
vi.mock('sharp', () => ({
  default: vi.fn(() => mockSharpInstance)
}))

// fs mocks (selective)
import fs from 'fs'

describe('ImageBaserow', () => {
  const axiosGet = (axios as unknown as { get: ReturnType<typeof vi.fn> }).get
  const imageDir = '/tmp/images'
  const metadataPath = '/tmp/images/metadata.json'

  beforeEach(() => {
    vi.restoreAllMocks()
    // reset sharp chain mocks
    mockMetadata.mockReset()
    mockResize.mockReset()
    mockWebp.mockReset()
    mockToBuffer.mockReset()

    // fs: make directory reads/writes no-op
    vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {
      /** empty comment */
    })
    vi.spyOn(fs, 'readFileSync').mockImplementation(() => '{}')
    vi.spyOn(fs, 'existsSync').mockImplementation((p) => p === metadataPath)
    vi.spyOn(fs, 'readdirSync').mockImplementation(() => [])
    vi.spyOn(fs, 'unlinkSync').mockImplementation(() => {
      /** empty comment */
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const link = (id: number): LinkObject => ({ id, value: String(id) })

  const imageTableRow = (over: Partial<ImageTable> = {}): ImageTable => ({
    id: 42,
    Titre: 'Mon Image Test',
    'Alt-text': 'Texte alternatif',
    'Image URL TEE': 'Logo ADEME',
    Image: [
      {
        url: 'https://cdn.example.com/file.png',
        visible_name: 'fichier.png',
        uploaded_at: '2024-01-01T00:00:00Z'
      }
    ],
    ...over
  })

  const directImage = (over: Partial<Image> = {}): Image[] => [
    {
      url: 'https://cdn.example.com/direct.png',
      visible_name: 'Nom Visible',
      uploaded_at: '2024-01-01T00:00:00Z',
      ...over
    }
  ]

  // Create a subclass to stub _getRowData without touching visibility
  class TestImageBaserow extends ImageBaserow {
    constructor(
      imageDirectory: string,
      metadataFilePath?: string,
      quality?: number,
      publicPath?: string,
      private _row?: ImageTable | null
    ) {
      super(imageDirectory, metadataFilePath, quality, publicPath)
    }
    // @ts-expect-error override protected/private for tests
    protected async _getRowData() {
      return this._row
    }
  }

  test('handleImageFromImageTable - télécharge, convertit, écrit et retourne le chemin', async () => {
    const row = imageTableRow()
    const sut = new TestImageBaserow(imageDir, metadataPath, 60, undefined, row)

    // axios returns binary buffer
    const bin = Buffer.from('img', 'utf-8')
    axiosGet.mockResolvedValueOnce({ data: bin })

    // sharp behaviours
    mockMetadata.mockResolvedValueOnce({ width: 2000 })
    const webp = Buffer.from('webp', 'utf-8')
    mockToBuffer.mockResolvedValueOnce(webp)

    const res = await sut.handleImageFromImageTable([link(1)])

    expect(res.isOk).toBe(true)
    if (res.isOk) {
      expect(res.value).toBe('logo-ademe.webp') // slug de "Logo ADEME"
    }
    // Vérifie conversion et écriture
    expect(mockResize).toHaveBeenCalledWith(1280)
    expect(mockWebp).toHaveBeenCalledWith({ quality: 60 })
    expect(fs.writeFileSync).toHaveBeenCalled()
    const writeArgs = (fs.writeFileSync as unknown as Mock).mock.calls[0]
    expect(writeArgs[0]).toBe(path.join(imageDir, 'logo-ademe.webp'))
    expect(writeArgs[1]).toBe(webp)
  })

  test("handleImageFromImageTable - n'effectue pas de téléchargement si déjà présent (métadonnées)", async () => {
    // Prépare des métadonnées existantes qui correspondent à la date d'upload
    vi.spyOn(fs, 'readFileSync').mockImplementation(() => JSON.stringify({ 'logo-ademe': '2024-01-01T00:00:00Z' }))
    const row = imageTableRow()
    const sut = new TestImageBaserow(imageDir, metadataPath, 60, undefined, row)

    const res = await sut.handleImageFromImageTable([link(1)])
    expect(res.isOk).toBe(true)
    expect(axiosGet).not.toHaveBeenCalled()
    expect(fs.writeFileSync).not.toHaveBeenCalledWith(path.join(imageDir, 'logo-ademe.webp'), expect.any(Buffer))
  })

  test('handleDirectImage - succès', async () => {
    const sut = new TestImageBaserow(imageDir, metadataPath)
    axiosGet.mockResolvedValueOnce({ data: Buffer.from('x') })
    mockMetadata.mockResolvedValueOnce({ width: 500 }) // pas de resize
    const webp = Buffer.from('y')
    mockToBuffer.mockResolvedValueOnce(webp)

    const res = await sut.handleDirectImage(directImage({ visible_name: 'Mon Événement!' }))
    expect(res.isOk).toBe(true)
    if (res.isOk) {
      expect(res.value).toBe('mon-evenement.webp')
    }
    expect(fs.writeFileSync).toHaveBeenCalledWith(path.join(imageDir, 'mon-evenement.webp'), webp)
  })

  test('handleDirectImage - erreur de téléchargement', async () => {
    const sut = new TestImageBaserow(imageDir, metadataPath)
    axiosGet.mockRejectedValueOnce(new Error('network'))

    const res = await sut.handleDirectImage(directImage())
    expect(res.isErr).toBe(true)
  })

  test('handleDirectImage - erreur à l’écriture du fichier', async () => {
    const sut = new TestImageBaserow(imageDir, metadataPath)
    axiosGet.mockResolvedValueOnce({ data: Buffer.from('x') })
    mockMetadata.mockResolvedValueOnce({ width: 500 })
    mockToBuffer.mockResolvedValueOnce(Buffer.from('y'))
    ;(fs.writeFileSync as unknown as Mock).mockImplementationOnce(() => {
      throw new Error('write failed')
    })

    const res = await sut.handleDirectImage(directImage())
    expect(res.isErr).toBe(true)
  })

  test('cleanup - supprime les fichiers non traités et sauvegarde les métadonnées', async () => {
    // Processes an image to add it to the "processed" files
    const row = imageTableRow()
    const sut = new TestImageBaserow(imageDir, metadataPath, 60, undefined, row)
    axiosGet.mockResolvedValueOnce({ data: Buffer.from('z') })
    mockMetadata.mockResolvedValueOnce({ width: 500 })
    mockToBuffer.mockResolvedValueOnce(Buffer.from('w'))
    const ok = await sut.handleImageFromImageTable([link(1)])
    expect(ok.isOk).toBe(true)

    // The file contains the processed image + an obsolete file
    ;(fs.readdirSync as unknown as Mock).mockReturnValueOnce(['logo-ademe.webp', 'obsolete.webp'])

    sut.cleanup()

    // Check that the obsolete file has been deleted
    expect(fs.unlinkSync).toHaveBeenCalledWith(path.join(imageDir, 'obsolete.webp'))

    // Verify metadata backup
    expect(fs.writeFileSync).toHaveBeenCalledWith(metadataPath, expect.stringContaining('logo-ademe'))
  })
})
