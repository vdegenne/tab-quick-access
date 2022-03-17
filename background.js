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

    case 'focus_first_lens':
      focusFirstLens()
      break;
  }
})

async function switchToLangRoutes () {
  const tabs = await chrome.tabs.query({})
  // Selection on the current visible window tab?
  returned = await chrome.scripting.executeScript(
    {
      func: () => document.getSelection().toString(),
      target: { tabId: (await chrome.tabs.query({ currentWindow: true, active: true }))[0].id }
    }
  )
  const selection = returned[0].result

  const tab = tabs.find(t => t.title.includes('Lang routes'))
  chrome.windows.update(tab.windowId, { focused: true })
  // @TODO: If no instance was found, create a new Google Translate Tab
  await chrome.tabs.update(tab.id, { active: true })
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
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

  // Selection on the current visible window tab?
  const returned = await chrome.scripting.executeScript(
    {
      func: () => document.getSelection().toString(),
      target: { tabId: (await chrome.tabs.query({ currentWindow: true, active: true }))[0].id }
    }
  )
  const selection = returned[0].result

  // If there is no selection and the page is Google Lens we verify either a word is selected or not
  // if (selection === '' && tabs.find(t => t.active).title === 'Google Lens') {
  //   console.log(document.querySelector('h2'))
  //   return;
  //   // const result = await chrome.scripting
  // }
  let tab = tabs.find(t => t.title.includes('Google Translate')) // Translate tab
  let newTab = false
  // If no instance was found, create a new Google Translate Tab
  if (tab) {
    // We focus the window first
    chrome.windows.update(tab.windowId, { focused: true })
    await chrome.tabs.update(tab.id, { active: true })
  }
  else { // we create a new tab
    let url = `https://translate.google.com/`
    if (selection) {
      url += `?text=${encodeURIComponent(selection)}`
    }
    tab = await chrome.tabs.create({ url })
    newTab = true;
  }

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
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
      console.log(newTab)
      if (newTab === false) {
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
  // Find the selected text into the current page
  // console.log(document.getSelection().toString())
  // const tabId = (await chrome.tabs.query({ active: true }))[0].id

  // Selection on the current visible window tab?
  const returned = await chrome.scripting.executeScript(
    {
      func: () => document.getSelection().toString(),
      target: { tabId: (await chrome.tabs.query({ currentWindow: true, active: true }))[0].id }
    }
  )
  const selection = returned[0].result
  if (!selection) {
    return
  }

  chrome.tabs.create({
    url: `https://translate.google.com/?text=${encodeURIComponent(selection)}`
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
  // Find the selected text into the current page
  // console.log(document.getSelection().toString())
  // const tabId = (await chrome.tabs.query({ active: true }))[0].id

  // Selection on the current visible window tab?
  const returned = await chrome.scripting.executeScript(
    {
      func: () => document.getSelection().toString(),
      target: { tabId: (await chrome.tabs.query({ currentWindow: true, active: true }))[0].id }
    }
  )
  const selection = returned[0].result

  if (!selection) {
    return;
  }

  const tab = await chrome.tabs.create({
    url: `http://www.google.com/search?q=${encodeURIComponent(selection)}&tbm=isch`
  })
}

async function openNaver () {
  const tabs = await chrome.tabs.query({});
  // Find the selected text into the current page
  // console.log(document.getSelection().toString())
  // const tabId = (await chrome.tabs.query({ active: true }))[0].id

  // Selection on the current visible window tab?
  const returned = await chrome.scripting.executeScript(
    {
      func: () => document.getSelection().toString(),
      target: { tabId: (await chrome.tabs.query({ currentWindow: true, active: true }))[0].id }
    }
  )
  const selection = returned[0].result

  if (!selection) {
    return;
  }

  const tab = await chrome.tabs.create({
    url: `https://dict.naver.com/search.nhn?query=${encodeURIComponent(selection)}`
  })
}

async function focusFirstLens () {
  const tabs = await chrome.tabs.query({});
  const tab = tabs.find(t => t.title.includes('Google Lens'))
  chrome.windows.update(tab.windowId, { focused: true })
  // @TODO: If no instance was found, create a new Google Translate Tab
  if (!tab) {
    return
  }
  await chrome.tabs.update(tab.id, { active: true })
}