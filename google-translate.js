const voiceButtons = document.querySelectorAll('[aria-label="Translate by voice"]')
const voiceButton = voiceButtons[voiceButtons.length - 1]
const listenButtons = document.querySelectorAll('[aria-label="Listen to source text"]')
const listenButton = listenButtons[listenButtons.length - 1]
window.addEventListener('keydown', function (e) {
  // D for Dictate
  if (e.altKey && (e.key === 'd' || e.key === 'D')) {
    e.preventDefault()
    voiceButton.click()
  }

  // S for Speak text
  if ((e.key === 's' || e.key === 'S')) {
    if (e.target.nodeName === 'TEXTAREA') {
      return
    }
    e.preventDefault()
    listenButton.click()
  }

  return false
})