(function () {
	'use strict';

	function getAugmentedNamespace(n) {
		if (n.__esModule) return n;
		var a = Object.defineProperty({}, '__esModule', {value: true});
		Object.keys(n).forEach(function (k) {
			var d = Object.getOwnPropertyDescriptor(n, k);
			Object.defineProperty(a, k, d.get ? d : {
				enumerable: true,
				get: function () {
					return n[k];
				}
			});
		});
		return a;
	}

	var background = {};

	var chineseRegStringExp = '[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]';
	var japaneseRegStringExp = '[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]';
	var koreanRegStringExp = '[\uac00-\ud7af]|[\u1100-\u11ff]|[\u3130-\u318f]|[\ua960-\ua97f]|[\ud7b0-\ud7ff]';
	var chineseRegExp = new RegExp("(".concat(chineseRegStringExp, ")+"));
	var japaneseRegExp = new RegExp("(".concat(japaneseRegStringExp, ")+"));
	var koreanRegExp = new RegExp("(".concat(koreanRegStringExp, ")+"));
	var chineseFullRegExp = new RegExp("^(".concat(chineseRegStringExp, ")+$"), 'g');
	var japaneseFullRegExp = new RegExp("^(".concat(japaneseRegStringExp, ")+$"), 'g');
	var koreanFullRegExp = new RegExp("^(".concat(koreanRegStringExp, ")+$"), 'g');
	var hasChinese = function (input) { return !!input.match(chineseRegExp); };
	var hasJapanese = function (input) { return !!input.match(japaneseRegExp); };
	var hasKorean = function (input) { return !!input.match(koreanRegExp); };
	var isFullChinese$1 = function (input) { return !!input.match(chineseFullRegExp); };
	var isFullJapanese = function (input) { return !!input.match(japaneseFullRegExp); };
	var isFullKorean = function (input) { return !!input.match(koreanFullRegExp); };

	var asianRegexps = /*#__PURE__*/Object.freeze({
		__proto__: null,
		chineseRegStringExp: chineseRegStringExp,
		japaneseRegStringExp: japaneseRegStringExp,
		koreanRegStringExp: koreanRegStringExp,
		chineseRegExp: chineseRegExp,
		japaneseRegExp: japaneseRegExp,
		koreanRegExp: koreanRegExp,
		chineseFullRegExp: chineseFullRegExp,
		japaneseFullRegExp: japaneseFullRegExp,
		koreanFullRegExp: koreanFullRegExp,
		hasChinese: hasChinese,
		hasJapanese: hasJapanese,
		hasKorean: hasKorean,
		isFullChinese: isFullChinese$1,
		isFullJapanese: isFullJapanese,
		isFullKorean: isFullKorean
	});

	var require$$0 = /*@__PURE__*/getAugmentedNamespace(asianRegexps);

	const {isFullChinese} = require$$0;

	chrome.commands.onCommand.addListener(async command => {
	  switch (command) {


	    // LANG ROUTES SWITCH
	    case 'switch_to_lang_routes':
	      await switchToLangRoutes();
	      break;



	    // GOOGLE TRANSLATE SWITCH
	    // case 'switch_to_google_translate':
	    //   await switchToGoogleTranslate()
	    //   break;


	    // GOOGLE TRANSLATE OPEN
	    case 'open_google_translate':
	      await switchToGoogleTranslate();
	      break;

	    case 'open_google_images':
	      await openGoogleImages();
	      break;

	    case 'open_naver':
	      await openNaver();
	      break;

	    case 'open_jisho':
	      await openJisho();
	      break;

	    case 'open_mdbg':
	      await openMDBG();
	      break;

	    case 'focus_first_lens':
	      focusFirstLens();
	      break;
	  }
	});

	async function switchToLangRoutes () {
	  const tabs = await chrome.tabs.query({});
	  const currentTab = (await chrome.tabs.query({ currentWindow: true, active: true }))[0];

	  // Selection on the current visible window tab?
	  const selection = (await chrome.scripting.executeScript(
	    {
	      func: () => document.getSelection().toString(),
	      target: { tabId: currentTab.id }
	    }
	  ))[0].result;

	  let routesTab = tabs.find(t => t.title.includes('Lang routes'));

	  if (!routesTab) {
	    routesTab = await chrome.tabs.create({
	      url: 'https://langroutes.vdegenne.com/',
	      index: currentTab.index
	    });
	  }
	  else {
	    chrome.windows.update(routesTab.windowId, { focused: true });
	    await chrome.tabs.update(routesTab.id, { active: true });
	  }

	  chrome.scripting.executeScript({
	    target: { tabId: routesTab.id },
	    args: [selection],
	    world: 'MAIN',
	    func: async function (selection) {
	      window.app.textfield.nextElementSibling.click();
	      if (selection) {
	        window.app.query = selection;
	        await window.app.updateComplete;
	        window.app.search();
	        window.app.textfield.blur();
	      }
	    },
	  });
	}

	async function switchToGoogleTranslate() {
	  const tabs = await chrome.tabs.query({});
	  // Find the selected text into the current page
	  // console.log(document.getSelection().toString())
	  // const tabId = (await chrome.tabs.query({ active: true }))[0].id

	  const currentTab = (await chrome.tabs.query({ currentWindow: true, active: true }))[0];

	  // Selection on the current visible window tab?
	  const selection = (await chrome.scripting.executeScript(
	    {
	      func: () => document.getSelection().toString(),
	      target: { tabId: currentTab.id }
	    }
	  ))[0].result;

	  // If there is no selection and the page is Google Lens we verify either a word is selected or not
	  // if (selection === '' && tabs.find(t => t.active).title === 'Google Lens') {
	  //   console.log(document.querySelector('h2'))
	  //   return;
	  //   // const result = await chrome.scripting
	  // }
	  let translateTab = tabs.find(t => t.title.includes('Google Translate')); // Translate tab
	  let newTab = false;
	  // @TODO if no selection was made we focus the first found translate tab if there is one
	  // or if there is selection we open a new tab
	  if (translateTab && !selection) {
	    // We focus the window first
	    chrome.windows.update(translateTab.windowId, { focused: true });
	    await chrome.tabs.update(translateTab.id, { active: true });
	  }
	  else { // we create a new tab
	    let url = `https://translate.google.com/`;
	    if (selection) {
	      url += `?text=${encodeURIComponent(selection)}`;
	    }
	    translateTab = await chrome.tabs.create({ url, index: currentTab.index });
	    newTab = true;
	  }

	  await chrome.scripting.executeScript({
	    target: { tabId: translateTab.id },
	    args: [selection, newTab],
	    func: (selection, newTab) => {
	      // If no selection wait for voice
	      if (!selection) {
	        const voiceButtons = document.querySelectorAll('[aria-label="Translate by voice"]');
	        voiceButtons[voiceButtons.length - 1];
	        // voiceButton.click()
	        return;
	      }

	      // If the query was requested with the URL we pass the url change process
	      // console.log(newTab)
	      if (!newTab && selection) {
	        // Get the current url
	        const params = new URLSearchParams(window.location.search);
	        // Change the query part
	        params.set('text', selection);
	        // Rebuild the url
	        const newUrl = `${window.location.origin}/?${params.toString()}`;
	        // Create the anchor
	        const a = document.createElement('a');
	        a.href = newUrl;
	        // By clicking the link we make sure to trigger Google Translate pushstate system,
	        // Thus not reloading the page everytime we make a new search
	        a.click();
	      }
	    }
	  });
	}

	async function openGoogleImages () {
	  await chrome.tabs.query({});
	  const currentTab = (await chrome.tabs.query({ currentWindow: true, active: true }))[0];

	  // Selection on the current visible window tab?
	  const selection = (await chrome.scripting.executeScript(
	    {
	      func: () => document.getSelection().toString(),
	      target: { tabId: currentTab.id }
	    }
	  ))[0].result;

	  if (!selection) {
	    return;
	  }

	  await chrome.tabs.create({
	    url: `http://www.google.com/search?q=${encodeURIComponent(selection)}&tbm=isch`,
	    index: currentTab.index
	  });
	}

	async function openNaver () {
	  await chrome.tabs.query({});
	  const currentTab = (await chrome.tabs.query({ currentWindow: true, active: true }))[0];

	  // Selection on the current visible window tab?
	  const selection = (await chrome.scripting.executeScript(
	    {
	      func: () => document.getSelection().toString(),
	      target: { tabId: currentTab.id }
	    }
	  ))[0].result;

	  let url;
	  if (selection) {
	    if (selection.length === 1 && isFullChinese(selection)) {
	      // fetch naver hanzi link
	      const response = await fetch(`https://assiets.vdegenne.com/chinese/naver/${selection}`);
	      url = `https://hanja.dict.naver.com/${await response.text()}/learning`;
	    }
	    else {
	      // window.open(`https://ja.dict.naver.com/#/search?range=example&query=${encodeURIComponent(word)}`, '_blank')
	      url = `https://dict.naver.com/search.nhn?query=${encodeURIComponent(selection)}`;
	    }
	  }
	  else {
	    url = 'https://dict.naver.com/';
	  }

	  await chrome.tabs.create({ url, index: currentTab.index });
	}

	async function openJisho () {
	  await chrome.tabs.query({});
	  const currentTab = (await chrome.tabs.query({ currentWindow: true, active: true }))[0];

	  // Selection on the current visible window tab?
	  const selection = (await chrome.scripting.executeScript(
	    {
	      func: () => document.getSelection().toString(),
	      target: { tabId: currentTab.id }
	    }
	  ))[0].result;

	  let url;
	  if (selection) {
	    url = `https://jisho.org/search/${encodeURIComponent(selection)}`;
	  }
	  else {
	    url = 'https://jisho.org/';
	  }

	  await chrome.tabs.create({ url, index: currentTab.index });
	}

	async function openMDBG () {
	  await chrome.tabs.query({});
	  const currentTab = (await chrome.tabs.query({ currentWindow: true, active: true }))[0];

	  // Selection on the current visible window tab?
	  const selection = (await chrome.scripting.executeScript(
	    {
	      func: () => document.getSelection().toString(),
	      target: { tabId: currentTab.id }
	    }
	  ))[0].result;

	  if (!selection) {
	    return;
	  }

	  await chrome.tabs.create({
	    url: `https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=0&wdqb=${encodeURIComponent(selection)}`,
	    index: currentTab.index
	  });
	}

	async function focusFirstLens () {
	  const tabs = await chrome.tabs.query({});
	  // const currentTab = (await chrome.tabs.query({ currentWindow: true, active: true }))[0];

	  const tab = tabs.find(t => t.title.includes('Google Lens'));
	  chrome.windows.update(tab.windowId, { focused: true });
	  // @TODO: If no instance was found, create a new Google Translate Tab
	  if (!tab) {
	    return
	  }
	  await chrome.tabs.update(tab.id, { active: true });
	}

	return background;

})();
