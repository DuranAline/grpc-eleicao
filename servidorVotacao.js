import { loadPackageDefinition, Server, ServerCredentials } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";

// Lê as definições do protobuffer
const urnaDefinicoes = loadSync("./urna.proto");
const urnaProto = loadPackageDefinition(urnaDefinicoes);

// Criando os candidatos(as)
const candidatos = [
    {
        id: 1,
        numero: 51,
        nome: "Maria Pinguiha"
    },
    {
        id: 2,
        numero: 17,
        nome: "Tadeu Patriota"
    }
]

const votos = []

function verificaEleitor(ipEleitor) {
    return votos.find(voto => voto.ipEleitor == ipEleitor)
}

//Criando o objeto Servidor
const servidorVotacao = new Server();
servidorVotacao.addService(urnaProto.UrnaServico.service, {
    listarCandidatos: (call, callBack) => {
        callBack(null, { listaCandidatos: candidatos })
    },

    votar: (call, callBack) => {
        if(!verificaEleitor(call.getPeer())) {
            const votoEleitor = call.request
            const index = candidatos.findIndex(candidato => candidato.numero == votoEleitor.numero)
            const candidatoVotado = candidatos[index]
            //console.log(votoEleitor, candidatoVotado);
            const voto = {
                nomeCandidato: candidatoVotado.nome,
                numeroCandidato: candidatoVotado.numero,
                ipEleitor: call.getPeer()
            }
            //console.log(voto);
            votos.push(voto)
            callBack(null, candidatoVotado)
        } 
    },
    listarVotos: (call, callBack) =>{
        //console.log(votos);
        callBack(null, {listaVotos: votos})
    }

});

const enderecoServidor = "0.0.0.0:5050";
servidorVotacao.bindAsync(enderecoServidor, ServerCredentials.createInsecure(), () => {
    console.log("Servidor está funcionando bem...");
})