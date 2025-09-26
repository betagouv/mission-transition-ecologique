import { useImage } from '#imports'

export class Image {
  static getUrl(source: string, modifier?: object): string {
    const image = useImage()
    return image(source, modifier)
  }
}
