import { credentials, loadPackageDefinition } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import readline from 'readline';

// Lê as definições do protobuffer
const urnaDefinicoes = loadSync("./urna.proto");
const urnaProto = loadPackageDefinition(urnaDefinicoes);

const clienteResultado = new urnaProto.UrnaServico('127.0.0.1:5051', credentials.createInsecure());
clienteResultado.apuracao({}, (erro, listaApuracao) => {
    if (erro){
        console.log(erro);
        return;
    }
    listaApuracao.listaApuracao.map((apuracao) => {
        console.log("Candidato: " + apuracao.candidato.nome + ", total de votos: " + apuracao.candidato.qtdeVoto +" - " + apuracao.porcentagemVoto.toFixed(2) + "%");
    })
})