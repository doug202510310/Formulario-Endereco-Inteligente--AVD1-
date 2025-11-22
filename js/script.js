 const cepInput = document.getElementById('cep');
        const logradouroInput = document.getElementById('logradouro');
        const bairroInput = document.getElementById('bairro');
        const cidadeInput = document.getElementById('cidade');
        const ufInput = document.getElementById('uf');
        const numeroInput = document.getElementById('numero');
        const errorMessage = document.getElementById('cep-error');
        const loadingSpinner = document.getElementById('loading-spinner');

        const limparFormulario = () => {
            logradouroInput.value = '';
            bairroInput.value = '';
            cidadeInput.value = '';
            ufInput.value = '';
            
            // Remove classes de erro do CSS puro
            errorMessage.classList.remove('visible');
            cepInput.classList.remove('input-error');
        }

        const eCepValido = (cep) => /^[0-9]{8}$/.test(cep);

        const pesquisarCep = async () => {
            limparFormulario();
            
            const cep = cepInput.value.replace(/\D/g, '');

            if (cep === "") return;

            if (eCepValido(cep)) {
                loadingSpinner.classList.add('active');
                cepInput.disabled = true;

                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                    const data = await response.json();

                    if (!data.erro) {
                        logradouroInput.value = data.logradouro;
                        bairroInput.value = data.bairro;
                        cidadeInput.value = data.localidade;
                        ufInput.value = data.uf;
                        numeroInput.focus();
                    } else {
                        mostrarErro('CEP não encontrado.');
                    }
                } catch (error) {
                    mostrarErro('Erro na conexão.');
                    console.error(error);
                } finally {
                    loadingSpinner.classList.remove('active');
                    cepInput.disabled = false;
                    if(!logradouroInput.value) cepInput.focus();
                }
            } else {
                mostrarErro('CEP inválido.');
            }
        };

        const mostrarErro = (mensagem) => {
            errorMessage.textContent = mensagem;
            errorMessage.classList.add('visible');
            cepInput.classList.add('input-error');
        }

        cepInput.addEventListener('blur', pesquisarCep);

        cepInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.substring(0, 5) + '-' + value.substring(5, 9);
            }
            e.target.value = value;
        });

        document.getElementById('addressForm').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Formulário enviado com sucesso!');
        });