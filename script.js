
const intro = document.getElementById('intro');
const booth = document.getElementById('booth');
const enterBtn = document.getElementById('enterBtn');
const video = document.getElementById('video');

enterBtn.onclick = async () => {
  intro.classList.add('hidden');
  booth.classList.remove('hidden');
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
};
