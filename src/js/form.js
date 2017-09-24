(function () {
    var me ={};
    var form =document.querySelector('.form-container');
    var closeFormButton = null;

    function onClose(e) {
        e.preventDefault();
        me.close();

        closeFormButton.removeEventListener('click',onClose);
    }

    function onCloseEsc() {
        me.close();
        window.removeEventListener('keydown',onCloseEsc);
    }

    me.open = function () {
        form.classList.remove('is-hidden');

        closeFormButton = document.querySelector('.form__close-button');
        if (closeFormButton){
            closeFormButton.addEventListener('click',onClose);
            window.addEventListener('keyup',onCloseEsc);
        }
    };

    me.close = function () {
        form.classList.add('is-hidden')
    };


    window.form = me;
}());