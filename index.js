async function dataAPI() {
    let url = 'https://indodax.com/api/summaries'
    let obj = await (await fetch(url)).json();

    //console.log(obj);
    return obj;
}

async function dataLokal() {
    let url = 'db.json'
    let obj = await (await fetch(url)).json();

    //console.log(obj);
    return obj;
}

var reloadData = 30; // dalam detik
var timer;

async function updateDataAPI() {
    let d1 = await dataAPI()
    let d2 = await dataLokal()
    // console.log(d1, d2)

    $('#tbody_lokal').html('')
    $('#tbody').html('');

    var row_lokal;
    for (let key in d2) {
        row_lokal = `<tr>
                        <td>` + d2[key].nama_cc + `</td>
                        <td align='right'>` + formatNumber(d2[key].harga_beli) + `</td>
                        <td align='right'>` + d2[key].jumlah_cc + `</td>
                        <td align='right'>` + formatNumber(d1.tickers[d2[key].nama_cc.toLowerCase()].buy) + `</td>
                        <td align='right'>` + formatNumber(String(parseInt(d2[key].jumlah_cc) * parseInt(d1
            .tickers[
                d2[key].nama_cc.toLowerCase()].buy))) + `</td>
                        <td align='right'>` + formatNumber(String((parseInt(d2[key].jumlah_cc) * parseInt(d1
            .tickers[
                d2[key].nama_cc.toLowerCase()].buy)) - (parseInt(d2[key].jumlah_cc) * parseInt(
            d2[key].harga_beli)))) + `</td>
                        <td align='right'>` + ((parseInt(d1.tickers[d2[key].nama_cc.toLowerCase()].buy) * 100 / parseInt(d2[key].harga_beli)) - 100) + `</td>
                        <td align='right'>` + formatNumber(String(Math.round((parseInt(d2[key].jumlah_cc) * parseInt(d1
            .tickers[
                d2[key].nama_cc.toLowerCase()].buy)) / 100 * 0.51))) + `</td>
                    </tr>`
        $('#tbody_lokal').append(row_lokal);
    }

    var row;
    for (let key in d1.tickers) {
        row = `<tr>
                        <td>` + key.toUpperCase() + `</td>
                        <td align='right'>` + formatNumber(d1.tickers[key].last) + `</td>
                        <td align='right'>` + formatNumber(d1.tickers[key].buy) + `</td>
                        <td align='right'>` + formatNumber(d1.tickers[key].sell) + `</td>
                        <td align='right'>` + formatNumber(d1.tickers[key].high) + `</td>
                        <td align='right'>` + formatNumber(d1.tickers[key].low) + `</td>
                        </tr>`
        $('#tbody').append(row);
    }


    clearTimeout(timer)
    $('#timer').html(reloadData)
    setTimeout(updateDataAPI, reloadData * 1000)
    updateTimer()

    setTimeout(tabelData, 500);
}

function tabelData() {
    $('#tabel').DataTable();
}

function updateTimer() {
    a = parseInt($('#timer').html())
    if (a > 0) {
        $('#timer').html(a - 1)
        timer = setTimeout(updateTimer, 1000)
    }
}

function formatNumber(n) {
    if (n.indexOf('.') > -1)
        return parseFloat(n).toFixed(8);
    else
        return parseInt(n).toLocaleString("id-ID")
}

updateDataAPI()