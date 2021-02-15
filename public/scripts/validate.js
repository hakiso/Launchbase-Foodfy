const Validate = {
    apply(input, func) {
        Validate.clearErrors(input);
        let results = Validate[func](input.value);

        if (results.error) Validate.displayError(input, results.error);
    },
    displayError(input, error) {
        const div = document.createElement('div');
        div.classList.add('error');
        div.innerText = error;
        input.parentNode.appendChild(div);

        input.focus()
    },
    clearErrors(input) {
        let errorDiv;
        const formErrors = document.querySelectorAll('.error.messages');
        if (input) errorDiv = input.parentNode.querySelector('.error');
        if (errorDiv) errorDiv.remove();
        if (formErrors) formErrors.forEach(error => error.remove());
    },
    isEmail(value) {
        let error = null;
        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (!value.match(mailFormat)) error = 'Email inválido';

        return {
            error,
            value
        };
    },
    allFields(event) {
        Validate.clearErrors();

        const items = document.querySelectorAll('.item input, .item select, .item textarea');
        items.forEach(item => {
            item.style.borderColor = '#ddd';
            if (item.value == '' && item.name != 'removed_files' && item.type != 'file') {
                const message = document.createElement('div');
                message.classList.add('messages');
                message.classList.add('error');
                message.innerHTML = 'Por favor, preencha todos os campos.';
                document.querySelector('body').appendChild(message);
                item.style.borderColor = '#ff3131';
                event.preventDefault();
            }
        });
    }
}

const formError = document.querySelector('.error.messages');
if (formError) {
    const fields = document.querySelectorAll('input');
    fields.forEach(field => field.style.borderColor = '#ff3131');
}