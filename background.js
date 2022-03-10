chrome.commands.onCommand.addListener(async command => {
  switch (command) {



    // LANG ROUTES
    case 'switch_to_lang_routes':
      const tabs = await chrome.tabs.query({})
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



  }
})