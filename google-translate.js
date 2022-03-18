window.addEventListener('keydown', function (e) {
  // D for Dictate
  if (e.altKey === true && (e.key === 'd' || e.key === 'D')) {
    e.preventDefault()
    const voiceButtons = document.querySelectorAll('[aria-label="Translate by voice"],[aria-label="音声入力による翻訳"]')
    const voiceButton = voiceButtons[voiceButtons.length - 1]
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
    const listenButtons = document.querySelectorAll('[aria-label="Listen to source text"],[aria-label="原文を聞く"]')
    const listenButton = listenButtons[listenButtons.length - 1]
    listenButton.click()
  }

  if (e.altKey === true && (e.key === 'l' || e.key === 'L')) {
    const ta = document.querySelectorAll('textarea')[0]
    ta.focus()
  }

  return false
})