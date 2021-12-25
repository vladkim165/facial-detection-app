let video = document.getElementById("video");
let model;

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const accessCamera = () => {
  navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: { width: 500, height: 400 },
    })
    .then((stream) => {
      video.srcObject = stream;
    });
};

const detectFaces = async () => {
  const prediction = await model.estimateFaces(video, false);

  // Использование canvas для рисования видео

  ctx.drawImage(video, 0, 0, 500, 400);

  prediction.forEach((predictions) => {

    // Рисование прямоугольника, который будет определять лицо
    ctx.beginPath();
    ctx.lineWidth = "4";
    ctx.strokeStyle = "yellow";
    ctx.rect(
      predictions.topLeft[0],
      predictions.topLeft[1],
      predictions.bottomRight[0] - predictions.topLeft[0],
      predictions.bottomRight[1] - predictions.topLeft[1]
    );
    // Последние два аргумента обозначают ширину и высоту,
    // но поскольку модели blazeface возвращают только координаты,  
    // мы должны вычесть их, чтобы получить ширину и высоту
    ctx.stroke();
  });
};

accessCamera();
video.addEventListener("loadeddata", async () => {
  model = await blazeface.load();
  // Вызов функции detectFaces каждые 40 миллисекунд
  setInterval(detectFaces, 40);
});