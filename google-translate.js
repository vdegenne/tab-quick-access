const voiceButtons = document.querySelectorAll('[aria-label="Translate by voice"]')
const voiceButton = voiceButtons[voiceButtons.length - 1]
window.addEventListener('keydown', function (e) {
  if (e.altKey && (e.key === 's' || e.key === 'S')) {
    voiceButton.click()
  }
})