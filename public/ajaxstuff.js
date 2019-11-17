
function ajax(method, resource, data) {
    let xhr = new XMLHttpRequest();

    let promise = new Promise((resolve, reject) => {
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    resolve(xhr);
                } else {
                    reject(xhr);
                }
            }
        };
    });

    xhr.open(method, resource, true);
    xhr.send(data);
    
    return promise;
}


function ajaxGet(resource, data) {
    let url;
    if (data !== null && data !== undefined) {
        // construct GET URI parameters from data
        let params = '';
        let count = 0;
        for (let datum of data) {
            let key = encodeURIComponent(datum[0]);
            let value = encodeURIComponent(datum[1]);
            params += `${key}=${value}&`;
        }
        url = `${resource}?${params}`;
    } else {
        url = resource;
    }
    return new Promise((resolve, reject) => {
        ajax('GET', url, null)
        .then((xhr) => {
            resolve(xhr.responseText);
        })
        .catch((xhr) => {
            reject(xhr.status, xhr.responseText);
        });
    });
}

function ajaxPost(resource, data) {
    return new Promise((resolve, reject) => {
        ajax('POST', resource, data)
        .then((xhr) => {
            resolve(xhr.responseText);
        })
        .catch((xhr) => {
            reject(xhr.status, xhr.responseText);
        });
    });
}