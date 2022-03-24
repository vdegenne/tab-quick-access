window.addEventListener('click', async function (e) {
  const path = e.composedPath()
  console.log(path)
  let row = path.filter((el, i) => i < 3 && el.classList && el.classList.contains && el.classList.contains('row'))
  if (row.length > 0) {
    row = row[0]
    let side = row.querySelector('.tail').innerHTML === '' ? row.querySelector('.head') : row.querySelector('.tail')
    side.querySelector('a').click()
    await new Promise(resolve => setTimeout(resolve, 500))
    const decompositionAnchor = row.nextElementSibling.querySelector('a[title="Show character decomposition"]')
    if (decompositionAnchor) {
      console.log(decompositionAnchor)
      decompositionAnchor.click()
    }
    // Show character decomposition
  }
})