import { credentials, loadPackageDefinition } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import readline from 'readline';

// Lê as definições do protobuffer
const urnaDefinicoes = loadSync("./urna.proto");
const urnaProto = loadPackageDefinition(urnaDefinicoes);

const clienteEleitor = new urnaProto.UrnaServico('127.0.0.1:5050', credentials.createInsecure());

clienteEleitor.listarCandidatos({}, (erro, listaCandidatos) => {
    if (erro){
        console.log(erro);
        return;
    }
    console.log("\nLista de Candidatos");
    listaCandidatos.listaCandidatos.map((candidato) => {
        console.log("Nome: " + candidato.nome + " número: " + candidato.numero);
    })
});

// Configura interface de leitura no terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question("Digite o número do seu candidato(a):", (input) => {
    const numeroCandidato = input
    votar(numeroCandidato)
    rl.close()
})

function votar(numeroCandidato) {
    clienteEleitor.Votar({numero: numeroCandidato}, (erro, candidatoVotado) => {
        if (erro){
            console.log("erro" + erro);
            return;
        }
        console.log("Votacão realizada com sucesso");
        console.log("Você votou em: " + candidatoVotado.nome);
    });
}