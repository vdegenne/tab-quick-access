chrome.commands.onCommand.addListener(async command => {
  let tabs;
  switch (command) {




    // LANG ROUTES
    case 'switch_to_lang_routes':
      tabs = await chrome.tabs.query({})
      const langroutesTab = tabs.find(t => t.title.includes('Lang routes'))
      await chrome.tabs.update(langroutesTab.id, { active: true })
      chrome.scripting.executeScript({
        func: () => {
          const s = document.createElement('script')
          s.src = chrome.runtime.getURL('lang-routes-focus.js')
          document.body.append(s)
        },
        target: { tabId: langroutesTab.id, allFrames: true }
      })
      break;





    // GOOGLE TRANSLATE
    case 'switch_to_google_translate':
      // Find the selected text into the current page
      // console.log(document.getSelection().toString())
      const tabId = (await chrome.tabs.query({ active: true }))[0].id
      const returned = await chrome.scripting.executeScript(
        {
          func: () => document.getSelection().toString(),
          target: { tabId }
        }
      )

      tabs = await chrome.tabs.query({});

      const selection = returned[0].result
      // If there is no selection and the page is Google Lens we verify either a word is selected or not
      // if (selection === '' && tabs.find(t => t.active).title === 'Google Lens') {
      //   console.log(document.querySelector('h2'))
      //   return;
      //   // const result = await chrome.scripting
      // }
      const tab = tabs.find(t => t.title.includes('Google Translate'))
      await chrome.tabs.update(tab.id, { active: true })
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        args: [selection],
        func: (selection) => {
          // If no selection wait for voice
          if (!selection) {
            const voiceButtons = document.querySelectorAll('[aria-label="Translate by voice"]')
            const voiceButton = voiceButtons[voiceButtons.length - 1]
            console.log(voiceButton)
            voiceButton.click()
            return;
          }
          // Get the current url
          const params = new URLSearchParams(window.location.search)
          // Change the query part
          params.set('text', selection)
          // Rebuild the url
          const newUrl = `${window.location.origin}/?${params.toString()}`
          // Create the anchor
          const a = document.createElement('a')
          a.href = newUrl
          // By clicking the link we make sure to trigger Google Translate pushstate system,
          // Thus not reloading the page everytime we make a new search
          a.click()
        }
      })
      break;
  }
})