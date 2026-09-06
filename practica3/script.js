document.addEventListener('DOMContentLoaded', function() {
    var btnActualizar = document.getElementById('btn-actualizar');
    
    btnActualizar.addEventListener('click', actualizarPrecios);
    
    cargarPreciosIniciales();
});

function cargarPreciosIniciales() {
    fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/mxn.json')
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Error en la respuesta: ' + response.status);
            }
            return response.json();
        })
        .then(function(data) {
            var rateUSD = data.mxn.usd;
            var rateJPY = data.mxn.jpy;
            actualizarPreciosEnPagina(rateUSD, rateJPY);
        })
        .catch(function(error) {
            console.error('Error al cargar precios:', error);
        });
}

function actualizarPrecios() {
    var btn = document.getElementById('btn-actualizar');
    var originalText = btn.textContent;
    
    btn.textContent = 'Actualizando...';
    btn.disabled = true;
    
    fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/mxn.json')
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Error en la respuesta: ' + response.status);
            }
            return response.json();
        })
        .then(function(data) {
            var rateUSD = data.mxn.usd;
            var rateJPY = data.mxn.jpy;
            
            actualizarPreciosEnPagina(rateUSD, rateJPY);
            
            btn.textContent = 'Precios Actualizados';
            btn.style.backgroundColor = '#27ae60';
            
            setTimeout(function() {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
                btn.disabled = false;
            }, 2000);
        })
        .catch(function(error) {
            console.error('Error al actualizar:', error);
            btn.textContent = 'Error - Intentar de nuevo';
            btn.style.backgroundColor = '#c0392b';
            
            setTimeout(function() {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
                btn.disabled = false;
            }, 2000);
        });
}

function actualizarPreciosEnPagina(rateUSD, rateJPY) {
    var amounts = document.querySelectorAll('.price-item .amount');
    
    for (var i = 0; i < amounts.length; i++) {
        var amountElement = amounts[i];
        var parent = amountElement.parentElement;
        var currencySpan = parent.querySelector('.currency');
        
        if (currencySpan && currencySpan.textContent.trim() === 'USD') {
            var mxnElement = parent.parentElement.querySelector('[data-mxn]');
            if (mxnElement) {
                var mxnValue = parseFloat(mxnElement.getAttribute('data-mxn'));
                var usdValue = (mxnValue * rateUSD).toFixed(2);
                amountElement.textContent = '$' + usdValue;
            }
        }
        
        if (currencySpan && currencySpan.textContent.trim() === 'YEN') {
            var mxnElement = parent.parentElement.querySelector('[data-mxn]');
            if (mxnElement) {
                var mxnValue = parseFloat(mxnElement.getAttribute('data-mxn'));
                var jpyValue = Math.round(mxnValue * rateJPY);
                amountElement.textContent = '\u00A5' + jpyValue.toLocaleString();
            }
        }
    }
}
