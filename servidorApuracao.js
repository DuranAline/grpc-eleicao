import { credentials, loadPackageDefinition, Server, ServerCredentials } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import readline from 'readline';

// Lê as definições do protobuffer
const urnaDefinicoes = loadSync("./urna.proto");
const urnaProto = loadPackageDefinition(urnaDefinicoes);

const apuracaoCliente = new urnaProto.UrnaServico('127.0.0.1:5050', credentials.createInsecure());

let dadosEleicao = [];
let listaApuracao = [];

function apurarVotos() {
    listaApuracao = [];
    let candidatoI = dadosEleicao.find((candidato) => candidato.numero == 51);
    let candidatoII = dadosEleicao.find((candidato) => candidato.numero == 17);
    let qtdeVotoTotal = candidatoI.qtdeVoto + candidatoII.qtdeVoto;

    dadosEleicao.map((candidato) => {
        listaApuracao.push(
            {
                candidato: candidato,
                porcentagemVoto: ((candidato.qtdeVoto / qtdeVotoTotal) * 100)
            }
        )
    })
}

apuracaoCliente.computarVotos({}, (erro, listaCandidatos)=> {
    if  (erro){
        console.log(erro);
        return;
    }

    dadosEleicao = listaCandidatos.listaCandidatos;
})

const servidorApuracao = new Server();
const enderecoServidor = "0.0.0.0:5051";
servidorApuracao.bindAsync(enderecoServidor, ServerCredentials.createInsecure(), () => {
    console.log("Servidor Apuracao está funcionando bem...");
})

servidorApuracao.addService(urnaProto.UrnaServico.service, {
    apuracao: (call, callBack) => {
        apurarVotos()
        callBack(null, {listaApuracao: listaApuracao})
    }
})