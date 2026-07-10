var updateText = document.querySelector(".bottom_update_value");
updateText.innerHTML = localStorage.getItem("update");

var date = new Date();

if (localStorage.getItem("cardUpdate") == null){
  localStorage.setItem("cardUpdate", "24.12.2024")
}

var update = document.querySelector(".update");
update.addEventListener('click', () => {
  var newDate = date.toLocaleDateString("pl-PL", options);
  localStorage.setItem("cardUpdate", newDate);
  updateText.innerHTML = newDate;

  scroll(0, 0)
});

document.querySelector('.bottom_update_value').innerHTML = localStorage.getItem('cardUpdate')

document.querySelector(".confirm_box .main_button").addEventListener('click', () => {
    var seriesAndNumber = localStorage.getItem('seriesAndNumber');
    if (seriesAndNumber) {
        console.log('seriesAndNumber from localStorage:', seriesAndNumber);
        navigator.clipboard.writeText(seriesAndNumber);
    }
});