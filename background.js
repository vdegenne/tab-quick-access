chrome.commands.onCommand.addListener(async command => {
  switch (command) {



    // LANG ROUTES
    case 'switch_to_lang_routes':
      const tabs = await chrome.tabs.query({})
      const langroutesTab = tabs.find(t => t.title.includes('Lang routes'))
      chrome.tabs.update(langroutesTab.id, { active: true })
      break;



  }
})