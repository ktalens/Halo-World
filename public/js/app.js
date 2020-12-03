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

const openGameTab = (e, gameOption) =>{
    // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(gameOption).style.display = "block";
  e.currentTarget.className += " active";

}

document.getElementById("defaultOpen").click();