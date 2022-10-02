let data;
let currencyLoaded = false;

!async function getData() {
    var myHeaders = new Headers();
    myHeaders.append("apikey", "HpMihVsqMQNWDTCPSYhmkapjfByMsTKM");

    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders
    };

    var today = new Date();
    today = today.toISOString().split('T')[0]

    let target = 1 // Monday
    let monday = new Date()
    monday.setDate(monday.getDate() - (monday.getDay() == target ? 7 : (monday.getDay() + (7 - target)) % 7))
    monday = monday.toISOString().split('T')[0]

    data = await fetch("https://api.apilayer.com/exchangerates_data/timeseries?base=PLN&start_date=" + monday + "&end_date=" + today, requestOptions)
        .then((response) => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error(error);
        });

    if(data){
        tableCreate(data.rates)
    }
}();

function tableCreate(rates) {
    const body = document.body,
        tbl = document.createElement('table');
    tbl.id = 'table';

    let currencies = Object.values(rates)[Object.keys(rates).length - 1];

    Object.keys(currencies).forEach(function (key) {

        const tr = tbl.insertRow();
        const td = tr.insertCell();
        td.insertAdjacentHTML('beforeend', `<a href="#" onclick="loadCurrencyData('${key}');return false;" data-currency="${key}">${key}</a> <br>${currencies[key]}`);

    });
    body.appendChild(tbl);

    for (let i = 0; i < 3; i++) {
    }
}

function loadCurrencyData(currency) {

    let rates = data.rates;
    const body = document.body;
    var tbl = document.getElementById("table");
    var tr = tbl.rows;

    for (var i = 0; i < tr.length; ++i) {
        if(currencyLoaded) {
            tr[i].deleteCell(1);
        }
        var td = document.createElement("td");

        if(Object.keys(rates).length > i){
            let rate = Object.values(rates)[i][currency];
            let date = Object.keys(rates)[i];
            td.insertAdjacentHTML('beforeend', `<span>${date} <br>${currency} <br>${rate}</span>`);
        } else {
            td.innerText = '';
        }
        tr[i].appendChild(td);
    }

    currencyLoaded = true;
    tbl.scrollIntoView({behavior: 'smooth'});
    body.appendChild(tbl);
}