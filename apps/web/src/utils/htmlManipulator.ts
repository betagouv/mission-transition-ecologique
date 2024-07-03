import { Ref } from 'vue'

export class HtmlManipulator {
  public static replacePlaceholderByHtmlElement(html: Ref<string>, placeholder: string, htmlElement?: HTMLElement) {
    if (htmlElement) {
      console.log(htmlElement.classList)
      htmlElement.classList.remove('fr-hidden')
      html.value = html.value.replace(placeholder, htmlElement.outerHTML)
      htmlElement.remove()
    }
  }
}
