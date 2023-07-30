function sayHi() {
    window.API.toMain("Hi from the rederer process!") 
}

const button = document.getElementById('send');
button.addEventListener('click', sayHi);