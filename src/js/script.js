// DECLARAÇÕES DOS ELEMENTOS
const videoElemento = document.getElementById("video");
const botaoScanear = document.getElementById("btn-texto");
const resultado = document.getElementById("saida");
const canvas = document.getElementById("canvas");

async function configurarCamera() {
    try {
        const midia = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }, 
            audio: false
        });
        videoElemento.srcObject = midia;
        //garantir que o vídeo comece a tocar
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

    // Ajusta o tamanho do canvas para o tamanho real do vídeo
    canvas.width = videoElemento.videoWidth;
    canvas.height = videoElemento.videoHeight;

    // Limpa e garante que a orientação seja a padrão (não espelhada)
    contexto.setTransform(1, 0, 0, 1, 0, 0);
    
    // Se você notar que o Tesseract está recebendo a imagem invertida, 
    // você pode descomentar as duas linhas abaixo para inverter o Canvas manualmente:


    // Aplica os filtros para melhorar o OCR
    contexto.filter = 'contrast(1.2) grayscale(1)';

    // Desenha o vídeo no canvas
    contexto.drawImage(videoElemento, 0, 0, canvas.width, canvas.height);

    try {
        const { data: { text } } = await Tesseract.recognize(
            canvas,
            'por'
        );
        
        const textoFinal = text.trim();
        resultado.innerText = textoFinal.length > 0 ? textoFinal : "Não foi possível identificar o texto";

    } catch (erro) {
        console.error(erro);
        resultado.innerText = "Erro no processamento: " + erro.message;
    } finally {
        botaoScanear.disabled = false;
    }
};