//DECLARAÇÕES DOS ELEMENTOS HTML PARA O DOM 
const videoElemento = document.getElementById("video");
const botaoScanear= document.getElementById("btn-texto");
const resultado = document.getElementById("saida");
const canvas = document.getElementById("canvas");

//METÓDO LIGAR CÂMERA

async function configurarCamera(){
    try{
        //solicita a permissão para acesar a camera do usuario
        const midia= await navigator.mediaDevices.getUserMedia({
            //habilita a camera traseira do celular
            video:{ facingMode:"enviroment"}, 
            audio:false
        });
        //atribui o fluxo da camera ao elemento de 
        // video para visualizar
        videoElemento.srcObject = midia;
    }catch(erro){
        resultado.innerText="Erro ao acessar a câmera",erro;
    }
}

//executa a função para habilitar camera
configurarCamera();

//CAPTURAR E LER O TEXTO

botaoScanear.onclick =async()=>{
    //DESATIVA O BOTAO PARA EVITAR MULTIPLOS CLIQUES
    botaoScanear.disabled = true;
    resultado.innerText ="fazendo a leitura...aguarde";

    //captura a imagem(foto)
    const contexto = canvas.getContext("2d");

    //Ajusta o tamanho do canvas interno para ser igual 
    // a do video
    canvas.width = videoElemento.videoWidth;
    canvas.height = videoElemento.videoHeight;

    //desenha o frame atual 
    // do video dentro do canvas(tira a foto)
    contexto.drawImage(videoElemento,0,0,canvas,canvas.height);

    //processando com a api Tesseract
    try{
        //função do tesserect
        const {data:{text}}= await Tesseract.recognize(
            canvas, //a imagem que acabou de capturar
            'por', // idioma em portugues
            {looger: m=>console.log(m)} //mostra no log
        )
        resultado.innerText = text.trim().length > 0 ? text : "Não foi possivel identificar o texto";

    }catch(erro){
        //resultado caso apresente um erro
        resultado.innerText="Erro no processamento",erro.message;
    }
    finally{
        //habilita o botão para uma nova leitura
        botaoScanear.disabled=false;
    }


}