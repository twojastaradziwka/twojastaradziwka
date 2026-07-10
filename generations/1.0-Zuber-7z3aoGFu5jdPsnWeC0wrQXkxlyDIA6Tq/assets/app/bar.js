
var params = new URLSearchParams(window.location.search);

var bar = document.querySelectorAll(".bottom_element_grid");

var top = localStorage.getItem('top');
var bottom;

if (localStorage.getItem('bottom')){
    bottom = localStorage.getItem('bottom');

    bar.forEach((element) => {
        var image = element.querySelector('.bottom_element_image');
        var text = element.querySelector('.bottom_element_text');

        var send = element.getAttribute('send');
        if (send === bottom){
            image.classList.add(bottom + "_open");
            text.classList.add("open");
        }else{
            image.classList.remove(send + "_open");
            image.classList.add(send);
            text.classList.remove("open");
        }
    })
}

function sendTo(url, top, bottom){
    // 1. Zapisujemy stan w pamięci przeglądarki (żeby wiedzieć, co podświetlić na nowej stronie)
    if (top){
        localStorage.setItem('top', top);
    }
    if (bottom){
        localStorage.setItem('bottom', bottom);
    }

    // 2. Pobieramy ID (jeśli nadal chcesz go używać lokalnie)
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    // 3. Zmieniamy adres z PHP na lokalny HTML
    // Zamiast: dowod.php?id=...&page=home
    // Robimy: home.html?id=...
    
    let newUrl = `${url}.html`;
    if (id) {
        newUrl += `?id=${id}`;
    }

    location.href = newUrl;
}

var options = { year: 'numeric', month: '2-digit', day: '2-digit' };
var optionsTime = { second: '2-digit', minute: '2-digit', hour: '2-digit' };

bar.forEach((element) => {
    element.addEventListener('click', () => {
        localStorage.removeItem('top');
        localStorage.removeItem('bottom');

        sendTo(element.getAttribute("send"))
    })
})

function getRandom(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function gotNewData(data){

    var seriesAndNumber = localStorage.getItem('seriesAndNumber');
    if (!seriesAndNumber){
        seriesAndNumber = "";
        var chars = "ABCDEFGHIJKLMNOPQRSTUWXYZ".split("");
        for (var i = 0; i < 4; i++){
            seriesAndNumber += chars[getRandom(0, chars.length)];
        }
        seriesAndNumber += " ";
        for (var i = 0; i < 5; i++){
            seriesAndNumber += getRandom(0, 9);
        }
        localStorage.setItem('seriesAndNumber', seriesAndNumber);
    }

    var day = data['day'];
    var month = data['month'];
    var year = data['year'];

    var birthdayDate = new Date();
    birthdayDate.setDate(day);
    birthdayDate.setMonth(month-1);
    birthdayDate.setFullYear(year);

    localStorage.setItem('birthDay', birthdayDate.toLocaleDateString("pl-PL", options));

    var givenDate = birthdayDate;
    givenDate.setFullYear(givenDate.getFullYear() + 18);
    localStorage.setItem('givenDate', givenDate.toLocaleDateString("pl-PL", options));

    var expiryDate = givenDate;
    expiryDate.setFullYear(expiryDate.getFullYear() + 5);
    localStorage.setItem('expiryDate', expiryDate.toLocaleDateString("pl-PL", options));

    var sex = data['sex'];
    
    if (parseInt(year) >= 2000){
        month = 20 + parseInt(month);
    }
    
    var later;
    
    if (sex === "m"){
        later = "0295"
    }else{
        later = "0382"
    }
    
    if (day < 10){
        day = "0" + day
    }
    
    if (month < 10){
        month = "0" + month
    }
    
    var pesel = year.toString().substring(2) + month + day + later + "7";
    localStorage.setItem('pesel', pesel);

    var dataEvent = window['dataReloadEvent'];
    if (dataEvent){
        dataEvent(data);
    }
}

loadImage();
async function loadImage() {
    var db = await getDb();
    var image = await getData(db, 'image');

    var imageEvent = window['imageReloadEvent'];

    if (image && imageEvent){
        imageEvent(image.image);
    }

    fetch('/images?' + params)
    .then(response => response.blob())
    .then(result => {
        var reader = new FileReader();
        reader.readAsDataURL(result);
        reader.onload = (event) => {
            var base = event.target.result;

            if (base !== image){
                if (imageEvent){
                    imageEvent(base);
                }

                var data = {
                    data: 'image',
                    image: base
                }

                saveData(db, data)
            }
        }
    })
}