const voiceButtons = document.querySelectorAll('[aria-label="Translate by voice"]')
const voiceButton = voiceButtons[voiceButtons.length - 1]
const listenButtons = document.querySelectorAll('[aria-label="Listen to source text"]')
const listenButton = listenButtons[listenButtons.length - 1]
window.addEventListener('keydown', function (e) {
  // D for Dictate
  if (e.altKey === true && (e.key === 'd' || e.key === 'D')) {
    e.preventDefault()
    // if (e.target.nodeName === 'TEXTAREA') {
    //   return
    // }
    voiceButton.click()
  }

  // S for Speak text
  if (e.altKey === false && (e.key === 's' || e.key === 'S')) {
    if (e.target.nodeName === 'TEXTAREA') {
      return
    }
    e.preventDefault()
    listenButton.click()
  }

  if (e.altKey === true && (e.key === 'l' || e.key === 'L')) {
    const ta = document.querySelectorAll('textarea')[0]
    ta.focus()
  }

  return false
})