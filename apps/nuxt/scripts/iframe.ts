import iframeResize from '@iframe-resizer/parent'

const script = document.getElementById('transition-ecologique-entreprise') as HTMLScriptElement | null

if (script) {
  setupIframe(script)
}

function setupIframe(element: HTMLScriptElement) {
  const url = new URL(element.src).origin
  const type = element.dataset.type || ''
  const id = element.dataset.id || ''
  const src = `${url}/iframe/${type}/${id}`

  const iframe = document.createElement('iframe')

  document.head.insertAdjacentHTML(
    'beforeend',
    `<style>
      #iframe-tee {
        border: none;
        display: block;
        margin: 10px auto;
        width: 100%;
      }

      #iframe-tee:fullscreen {
        width: 100%;
        height: 100%;
        max-height: 100%;
        max-width: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
    </style>`
  )

  const iframeAttributes = {
    src,
    style: 'border: none; width: 100%; display: block; margin: 0 auto;',
    allowfullscreen: true,
    webkitallowfullscreen: true,
    mozallowfullscreen: true,
    allow: 'fullscreen',
    id: 'iframe-tee'
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
