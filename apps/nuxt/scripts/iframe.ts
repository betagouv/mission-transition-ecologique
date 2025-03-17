import iframeResize from '@iframe-resizer/parent'

let script = document.currentScript as HTMLScriptElement | null

if (!script) {
  const scripts = document.getElementsByTagName('script')
  script = scripts[scripts.length - 1] as HTMLScriptElement | null
}

if (script) {
  setupIframe(script)
}

function setupIframe(element: HTMLScriptElement) {
  const url = new URL(element.src).origin
  const type = element.dataset.type || ''
  const id = element.dataset.id || ''
  const parentUrl = encodeURIComponent(window.location.href)
  const src = `${url}/iframe/${type}/${id}?parent_url=${parentUrl}&utm_campaign=iframe`

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
