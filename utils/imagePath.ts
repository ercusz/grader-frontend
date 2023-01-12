import { Image } from '@/types/types';

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_HOST;

export function getImagePath(image: Image | null): string {
  if (image) {
    if (image.url.startsWith('/')) {
      return strapiUrl + image.url;
    }

    return image.url;
  }

  return '';
}
