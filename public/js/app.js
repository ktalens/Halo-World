const openDropdown = (e) =>{
    let navOption = e.target.id
    let hiddenOptions= document.getElementById(`${navOption}Options`)
    hiddenOptions.classList.add('show')
    let clickedBtn = document.getElementById(navOption)
    clickedBtn.removeEventListener('click',openDropdown)
    clickedBtn.addEventListener('click',(e)=>{
        closeDropdown(e)
    })
}

const closeDropdown = (e) =>{
    let navOption = e.target.id
    let shownOptions =document.getElementById(`${navOption}Options`)
    shownOptions.classList.remove('show')
    let clickedBtn = document.getElementById(navOption)
    clickedBtn.removeEventListener('click',closeDropdown)
    clickedBtn.addEventListener('click',(e)=>{
        openDropdown(e)
    })
}