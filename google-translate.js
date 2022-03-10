const voiceButtons = document.querySelectorAll('[aria-label="Translate by voice"]')
const voiceButton = voiceButtons[voiceButtons.length - 1]
const listenButtons = document.querySelectorAll('[aria-label="Listen to source text"]')
const listenButton = listenButtons[listenButtons.length - 1]
window.addEventListener('keydown', function (e) {
  if (e.altKey && (e.key === 's' || e.key === 'S')) {
    voiceButton.click()
  }
  if (e.altKey && (e.key === 'd' || e.key === 'D')) {
    e.preventDefault()
    listenButton.click()
  }
})