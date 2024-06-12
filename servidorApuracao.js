import { credentials, loadPackageDefinition } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import readline from 'readline';

// Lê as definições do protobuffer
const urnaDefinicoes = loadSync("./urna.proto");
const urnaProto = loadPackageDefinition(urnaDefinicoes);

const apuracaoCliente = new urnaProto.UrnaServico('127.0.0.1:5050', credentials.createInsecure());

let votos = 0;
const apuracaoFinal = []

function apurarVotos() {
    console.log(1);
    let total = votos.length;
    let votoCandidatoI = 0;
    let votoCandidatoII = 0;
    
    votos.map((voto) => {
        if(voto.numeroCandidato == 51) {
            votoCandidatoI = votoCandidatoI + 1;
        } else {
            votoCandidatoII = votoCandidatoII + 1;
        }
    })

    let apuracaoCandidatoI = ((votoCandidatoI / total) * 100)
    let apuracaoCandidatoII = ((votoCandidatoII / total) * 100)
    console.log(votoCandidatoI, total);
    const candidatoI = {
        numero: 51,
        porcentagemVoto: apuracaoCandidatoI,
    }

    apuracaoFinal.push(candidatoI)

    const candidatoII = {
        numero: 17,
        porcentagemVoto: apuracaoCandidatoII,
    }

    apuracaoFinal.push(candidatoII)
}

apuracaoCliente.listarVotos({}, (erro, listarVotos)=> {
    if  (erro){
        console.log(erro);
        return;
    }
    votos = listarVotos.listaVotos;
})

const servidorApuracao = new Server();
const enderecoServidor = "0.0.0.0:5051";
servidorApuracao.bindAsync(enderecoServidor, ServerCredentials.createInsecure(), () => {
    console.log("Servidor Apuracao está funcionando bem...");
})

servidorApuracao.addService(urnaProto.UrnaServico.service, {
    apuracao: (call, callBack) => {
        apurarVotos()
        callBack(null, {listaApuracao: apuracaoFinal})
    }
})