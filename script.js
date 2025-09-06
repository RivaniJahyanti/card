// Countdown Timer
const countDownDate = new Date("Jul 20, 2025 09:00:00").getTime();
const timer = document.getElementById("timer");

setInterval(function() {
  const now = new Date().getTime();
  const distance = countDownDate - now;

  if (distance < 0) {
    timer.innerHTML = "Acara Sedang Berlangsung!";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  timer.innerHTML = `${days} Hari ${hours} Jam ${minutes} Menit ${seconds} Detik`;
}, 1000);
