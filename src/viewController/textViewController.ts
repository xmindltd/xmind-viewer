import ViewController from './viewController'
import TextView from '../view/textView'
import FontInfo from '../utils/fontInfo'

export default abstract class TextViewController extends ViewController {

  render() {
    this.view.render(this.parent.view)
  }

  set text(text: string) {
    text = this.handleText(text)
    this.view.text = text
  }

  get bounds() {
    return this.view.bounds
  }

  move(newX: number, newY: number) {
    if (this.view.fontInfo.textAlign === 'center') { newX += this.view.textSize.width / 2 }
    if (this.view.fontInfo.textAlign === 'right') { newX += this.view.textSize.width }

    this.view.textPosition = { x: newX, y: newY }
  }

  protected refreshFontInfo(fontInfo: FontInfo) {
    if (fontInfo) {
      this.view.fontInfo = fontInfo
    }
  }

  protected handleText(text: string): string {
    return text
  }

  abstract get view(): TextView

}