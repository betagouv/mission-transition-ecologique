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
        margin: 0 auto;
        width: 100%;
      }
    </style>`
  )

  const iframeAttributes = {
    src,
    style: 'border: none; width: 100%; display: block; margin: 0 auto;',
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
