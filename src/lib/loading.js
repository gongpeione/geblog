/**
 * Created by geeku on 10/05/2017.
 */
export default {
  loadingEl: null,
  show () {
    this.loadingEl && this.loadingEl.classList.add('show');
  },
  hide () {
    this.loadingEl && this.loadingEl.classList.remove('show');
  }
}
