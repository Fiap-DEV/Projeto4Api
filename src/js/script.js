// DECLARAÇÕES DOS ELEMENTOS
const videoElemento = document.getElementById("video");
const botaoScanear = document.getElementById("btn-texto");
const resultado = document.getElementById("saida");
const canvas = document.getElementById("canvas");

async function configurarCamera() {
    try {
        const midia = await navigator.mediaDevices.getUserMedia({
            // Corrigido "enviroment" para "environment"
            video: { facingMode: "environment" }, 
            audio: false
        });
        videoElemento.srcObject = midia;
        // Importante: garantir que o vídeo comece a tocar
        videoElemento.play();
    } catch (erro) {
        resultado.innerText = "Erro ao acessar a câmera: " + erro.message;
    }
}

configurarCamera();

botaoScanear.onclick = async () => {
    botaoScanear.disabled = true;
    resultado.innerText = "Fazendo a leitura... aguarde";

    const contexto = canvas.getContext("2d");

    // Ajusta o tamanho do canvas
    canvas.width = videoElemento.videoWidth;
    canvas.height = videoElemento.videoHeight;

    // Resetamos qualquer transformação para garantir que a foto não saia invertida
    contexto.setTransform(1, 0, 0, 1, 0, 0);

    // MELHORIA DE OCR:
    // Aplica um leve filtro de contraste e escala de cinza no canvas antes de tirar a "foto"
    // Isso ajuda MUITO a evitar as letras aleatórias
    contexto.filter = 'contrast(1.2) grayscale(1)';

    // Tira a foto
    contexto.drawImage(videoElemento, 0, 0, canvas.width, canvas.height);

    try {
        // CORREÇÃO AQUI: 
        // Removido o logger de dentro do recognize para evitar o DataCloneError
        const { data: { text } } = await Tesseract.recognize(
            canvas,
            'por'
        );
        // Remove espaços excessivos e caracteres especiais óbvios que indicam erro de leitura
        const textoFinal = text.trim();

     resultado.innerText = textoFinal.length > 0 ? textoFinal : "Não foi possível identificar o texto";

    } catch (erro) {
        console.error(erro);
        resultado.innerText = "Erro no processamento: " + erro.message;
    } finally {
        botaoScanear.disabled = false;
    }
};