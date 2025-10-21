// ----------------------------------------------------------------------
// 1. Variáveis Globais
// ----------------------------------------------------------------------

// Procura pelo campo de "CEP" no documento HTML
const txt_cep = document.querySelector("#cep");
const txt_rua = document.querySelector("#rua");
const txt_num = document.querySelector("#numero");
const txt_cidade = document.querySelector("#cidade");
const txt_bairro = document.querySelector("#bairro");

const loadingOverlay = document.querySelector("#loadingOverlay");

// ----------------------------------------------------------------------
// 2. Funções de Lógica
// ----------------------------------------------------------------------


function consultaCEP() {
    let cep= txt_cep.value;
    if (txt_cep.value.match(/^\d{5}-?\d{3}$/)); {
        // uma api permite que a gente obtenha informaçoes
        // sem sair da pagina
        //nooso objetivo é obter as informaçoes do ecp digittado
        //http://viacep.com.br/ws/12345123/jason/
        
        
        //remove o traço da variavel
        cep= cep.replace("-","");
        
        //exibe o spinner carregando
        loadingOverlay.classList.add('d-flex');
        loadingOverlay.classList.remove('d-none');
        
        fetch('https://viacep.com.br/ws/'+cep+'/json/')
        .then(function(response) {
            //oculta o spinner de "carregando" ao receber a resposta da API
            loadingOverlay.classList.add('d-flex');
            loadingOverlay.classList.remove('d-none');
            
            //converte a resposta para json
            return response.json();
        } )
        .then(function(jsonResponse){
            //exibe a resposta da api na console do navegador
            console.log(jsonResponse);
            
            //api da viacep retorna a chave erro quando cep
            //digitado é invalido
            if (jsonResponse.erro) {
                console.log("CEP invalido");
                txt_cep.classList.add("is-invalid");
            } else {
                //remove a mensagem cep invalido abaixo do campo de cep 
                txt_cep.classList.remove("is-invalid");
                
                txt_rua.value = jsonResponse.logradouro;
                txt_cidade.value = jsonResponse.localidade;
                txt_bairro.value = jsonResponse.bairro;
            }
            
        })
        
        
    }
}

// ----------------------------------------------------------------------
// 3. Escutadores de Eventos e Início
// ----------------------------------------------------------------------

// Executa função ao digitar qualquer tecla no campo "CEP"
txt_cep.addEventListener("keyup", consultaCEP);

// Adiciona máscara ao campo de CEP
jQuery(function($){
    $("#cep").mask("99999-999");
});
