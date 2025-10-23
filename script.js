// ----------------------------------------------------------------------
// 1. Variáveis Globais
// ----------------------------------------------------------------------

// Procura pelo campo de "CEP" no documento HTML
const txt_cep = document.querySelector("#cep");
const txt_rua = document.querySelector("#rua");
const txt_num = document.querySelector("#numero");
const txt_cidade = document.querySelector("#cidade");
const txt_bairro = document.querySelector("#bairro");
const txt_complemento = document.querySelectorAll("#complemento");
const slt_estado = document.querySelector("#estado");

const loadingOverlay = document.querySelector("#loadingOverlay");

const err_cep = document.querySelector("#cep-erro");

// ----------------------------------------------------------------------
// 2. Funções de Lógica
// ----------------------------------------------------------------------


function consultaCEP() {
    /*limpa e habilita os campos caso tenham sido desabilitados
    exemplo: usuario digitou u cep de uma cidade e dps de dois irmaos
    sem essa funçao, os campos nao preenchidos (rua, etc) continuam preenchidos com os dados anteriores */
    limpaCampos();
    
    let cep= txt_cep.value;
    if (cep.match(/^\d{5}-?\d{3}$/)) {
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
            loadingOverlay.classList.add('d-none');
            loadingOverlay.classList.remove('d-flex');
            
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
                
                if(jsonResponse.logradouro !== "") {
                    txt_rua.value = jsonResponse.logradouro;
                    txt_rua.disabled = true;
                }
                if(jsonResponse.localidade !== "") {
                    txt_cidade.value = jsonResponse.localidade;
                    txt_cidade.disabled = true;
                }
                if(jsonResponse.bairro !== "") {
                    txt_bairro.value = jsonResponse.bairro;
                    txt_bairro.disabled = true;
                }
                if(jsonResponse.uf !== "") {
                    slt_estado.value = jsonResponse.uf;
                    slt_estado.disabled = true;
                }
            }
            
        })
        .catch(error => {
            loadingOverlay.classList.add('d-none');
            loadingOverlay.classList.remove('d-flex');
            
            err_cep.innerHTML = "Falha na consulta ao CEP.\
    <a href='#' onclick='consultaCEP()'>Tentar novamente?</a>";
            txt_cep.classList.add("is-invalid");
        });
        
        
    }
}

function limpaCampos() {
    txt_rua.value = "";
    txt_cidade.value = "";
    txt_num.value = "";
    txt_bairro.value = "";
    txt_complemento.value = "";
    slt_estado.value = "";
    
    txt_rua.disabled = false;
    txt_cidade.disabled = false;
    txt_bairro.disabled = false;
    slt_estado.disabled = false;
    
    
    
}

// ----------------------------------------------------------------------
// 3. Escutadores de Eventos e Início
// ----------------------------------------------------------------------

// Executa função ao digitar qualquer tecla no campo "CEP"
txt_cep.addEventListener("keyup", consultaCEP);

// Adiciona máscara ao campo de CEP
jQuery(function($){
    $("#cep").mask("99999-999");
    //formata o campo de numero para aceitar somente numeros
    $('#numero').mask('0#', {
        translation: {
            '0': { pattern: /[0-9]/, recursive: true}
        }
    })
});
