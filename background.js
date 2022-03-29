chrome.commands.onCommand.addListener(async command => {
  switch (command) {


    // LANG ROUTES SWITCH
    case 'switch_to_lang_routes':
      await switchToLangRoutes()
      break;



    // GOOGLE TRANSLATE SWITCH
    // case 'switch_to_google_translate':
    //   await switchToGoogleTranslate()
    //   break;


    // GOOGLE TRANSLATE OPEN
    case 'open_google_translate':
      await switchToGoogleTranslate()
      break;

    case 'open_google_images':
      await openGoogleImages()
      break;

    case 'open_naver':
      await openNaver()
      break;

    case 'open_jisho':
      await openJisho()
      break;

    case 'open_mdbg':
      await openMDBG()
      break;

    case 'focus_first_lens':
      focusFirstLens()
      break;
  }
})

async function switchToLangRoutes () {
  const tabs = await chrome.tabs.query({})
  const currentTab = (await chrome.tabs.query({ currentWindow: true, active: true }))[0]

  // Selection on the current visible window tab?
  const selection = (await chrome.scripting.executeScript(
    {
      func: () => document.getSelection().toString(),
      target: { tabId: currentTab.id }
    }
  ))[0].result

  let routesTab = tabs.find(t => t.title.includes('Lang routes'))

  if (!routesTab) {
    routesTab = await chrome.tabs.create({
      url: 'https://langroutes.vdegenne.com/',
      index: currentTab.index
    })
  }
  else {
    chrome.windows.update(routesTab.windowId, { focused: true })
    await chrome.tabs.update(routesTab.id, { active: true })
  }

  chrome.scripting.executeScript({
    target: { tabId: routesTab.id },
    args: [selection],
    world: 'MAIN',
    func: async function (selection) {
      window.app.textfield.nextElementSibling.click()
      if (selection) {
        window.app.query = selection
        await window.app.updateComplete
        window.app.search()
        window.app.textfield.blur()
      }
    },
  })
}

async function switchToGoogleTranslate() {
  const tabs = await chrome.tabs.query({});
  // Find the selected text into the current page
  // console.log(document.getSelection().toString())
  // const tabId = (await chrome.tabs.query({ active: true }))[0].id

  const currentTab = (await chrome.tabs.query({ currentWindow: true, active: true }))[0]

  // Selection on the current visible window tab?
  const selection = (await chrome.scripting.executeScript(
    {
      func: () => document.getSelection().toString(),
      target: { tabId: currentTab.id }
    }
  ))[0].result

  // If there is no selection and the page is Google Lens we verify either a word is selected or not
  // if (selection === '' && tabs.find(t => t.active).title === 'Google Lens') {
  //   console.log(document.querySelector('h2'))
  //   return;
  //   // const result = await chrome.scripting
  // }
  let translateTab = tabs.find(t => t.title.includes('Google Translate')) // Translate tab
  let newTab = false
  // @TODO if no selection was made we focus the first found translate tab if there is one
  // or if there is selection we open a new tab
  if (translateTab && !selection) {
    // We focus the window first
    chrome.windows.update(translateTab.windowId, { focused: true })
    await chrome.tabs.update(translateTab.id, { active: true })
  }
  else { // we create a new tab
    let url = `https://translate.google.com/`
    if (selection) {
      url += `?text=${encodeURIComponent(selection)}`
    }
    translateTab = await chrome.tabs.create({ url, index: currentTab.index })
    newTab = true;
  }

  await chrome.scripting.executeScript({
    target: { tabId: translateTab.id },
    args: [selection, newTab],
    func: (selection, newTab) => {
      // If no selection wait for voice
      if (!selection) {
        const voiceButtons = document.querySelectorAll('[aria-label="Translate by voice"]')
        const voiceButton = voiceButtons[voiceButtons.length - 1]
        // voiceButton.click()
        return;
      }

      // If the query was requested with the URL we pass the url change process
      // console.log(newTab)
      if (!newTab && selection) {
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
    }
  })
}

async function openGoogleTranslate() {
  const tabs = await chrome.tabs.query({});
  const currentTab = (await chrome.tabs.query({ currentWindow: true, active: true }))[0];

  // Selection on the current visible window tab?
  const selection = (await chrome.scripting.executeScript(
    {
      func: () => document.getSelection().toString(),
      target: { tabId: currentTab.id }
    }
  ))[0].result

  if (!selection) {
    return
  }

  chrome.tabs.create({
    url: `https://translate.google.com/?text=${encodeURIComponent(selection)}`,
    index: currentTab.index
  })
  return

  // If there is no selection and the page is Google Lens we verify either a word is selected or not
  // if (selection === '' && tabs.find(t => t.active).title === 'Google Lens') {
  //   console.log(document.querySelector('h2'))
  //   return;
  //   // const result = await chrome.scripting
  // }
  const tab = tabs.find(t => t.title.includes('Google Translate'))
  chrome.windows.update(tab.windowId, { focused: true })
  // @TODO: If no instance was found, create a new Google Translate Tab
  await chrome.tabs.update(tab.id, { active: true })
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args: [selection],
    func: (selection) => {
      // If no selection wait for voice
      if (!selection) {
        const voiceButtons = document.querySelectorAll('[aria-label="Translate by voice"]')
        const voiceButton = voiceButtons[voiceButtons.length - 1]
        // voiceButton.click()
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
}

async function openGoogleImages () {
  const tabs = await chrome.tabs.query({});
  const currentTab = (await chrome.tabs.query({ currentWindow: true, active: true }))[0];

  // Selection on the current visible window tab?
  const selection = (await chrome.scripting.executeScript(
    {
      func: () => document.getSelection().toString(),
      target: { tabId: currentTab.id }
    }
  ))[0].result

  if (!selection) {
    return;
  }

  const tab = await chrome.tabs.create({
    url: `http://www.google.com/search?q=${encodeURIComponent(selection)}&tbm=isch`,
    index: currentTab.index
  })
}

async function openNaver () {
  const tabs = await chrome.tabs.query({});
  const currentTab = (await chrome.tabs.query({ currentWindow: true, active: true }))[0];

  // Selection on the current visible window tab?
  const selection = (await chrome.scripting.executeScript(
    {
      func: () => document.getSelection().toString(),
      target: { tabId: currentTab.id }
    }
  ))[0].result

  let url;
  if (selection) {
    url = `https://dict.naver.com/search.nhn?query=${encodeURIComponent(selection)}`
  }
  else {
    url = 'https://dict.naver.com/'
  }

  const tab = await chrome.tabs.create({ url, index: currentTab.index })
}

async function openJisho () {
  const tabs = await chrome.tabs.query({});
  const currentTab = (await chrome.tabs.query({ currentWindow: true, active: true }))[0];

  // Selection on the current visible window tab?
  const selection = (await chrome.scripting.executeScript(
    {
      func: () => document.getSelection().toString(),
      target: { tabId: currentTab.id }
    }
  ))[0].result

  let url
  if (selection) {
    url = `https://jisho.org/search/${encodeURIComponent(selection)}`
  }
  else {
    url = 'https://jisho.org/'
  }

  const tab = await chrome.tabs.create({ url, index: currentTab.index })
}

async function openMDBG () {
  const tabs = await chrome.tabs.query({});
  const currentTab = (await chrome.tabs.query({ currentWindow: true, active: true }))[0];

  // Selection on the current visible window tab?
  const selection = (await chrome.scripting.executeScript(
    {
      func: () => document.getSelection().toString(),
      target: { tabId: result.id }
    }
  ))[0].result

  if (!selection) {
    return;
  }

  const tab = await chrome.tabs.create({
    url: `https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=0&wdqb=${encodeURIComponent(selection)}`,
    index: currentTab.index
  })
}

async function focusFirstLens () {
  const tabs = await chrome.tabs.query({});
  // const currentTab = (await chrome.tabs.query({ currentWindow: true, active: true }))[0];

  const tab = tabs.find(t => t.title.includes('Google Lens'))
  chrome.windows.update(tab.windowId, { focused: true })
  // @TODO: If no instance was found, create a new Google Translate Tab
  if (!tab) {
    return
  }
  await chrome.tabs.update(tab.id, { active: true })
}