import iframeResize from '@iframe-resizer/parent'

let script = document.currentScript as HTMLScriptElement | null

if (!script) {
  const scripts = document.getElementsByTagName('script')
  script = scripts[scripts.length - 1] as HTMLScriptElement | null
}

if (script) {
  setupIframe(script)
}

interface IframeParams {
  scriptUrl: string
  type: string
  id: string
  parentUrl: string
  source?: string
}

function buildIframeUrl({ scriptUrl, type, id, parentUrl, source }: IframeParams): string {
  const origin = new URL(scriptUrl).origin
  const iframeBaseUrl = `${origin}/iframe`
  const utmCampaign = type === 'siret' ? 'iframe_siret' : 'iframe'

  const params = new URLSearchParams({
    parent_url: parentUrl,
    utm_campaign: utmCampaign
  })
  if (source) {
    params.set('utm_source', source)
  }

  switch (type) {
    case 'projet':
      return id ? `${iframeBaseUrl}/${type}/${id}?${params}` : `${iframeBaseUrl}?${params}`
    case 'siret':
      return `${iframeBaseUrl}/${type}?${params}`
    default:
      return `${iframeBaseUrl}?${params}`
  }
}

function setupIframe(element: HTMLScriptElement) {
  const src = buildIframeUrl({
    scriptUrl: element.src,
    type: element.dataset.type || '',
    id: element.dataset.id || '',
    parentUrl: window.location.href,
    source: element.dataset.source
  })

  const iframe = document.createElement('iframe')

  document.head.insertAdjacentHTML(
    'beforeend',
    `<style>
      .iframe-tee {
        border: none;
        display: block;
        margin: 0 auto;
        width: 100%;
      }
    </style>`
  )

  const iframeAttributes = {
    src,
    style: 'border: none; width: 100%; display: block; margin: 0 auto;',
    allow: 'fullscreen',
    class: 'iframe-tee'
  }

  for (const key in iframeAttributes) {
    iframe.setAttribute(key, iframeAttributes[key as keyof typeof iframeAttributes] as string)
  }

  if (element.parentNode) {
    element.parentNode.insertBefore(iframe, element)
  }

  iframe.onload = () => {
    iframeResize({ license: 'GPLv3', checkOrigin: false }, iframe)
  }
}
