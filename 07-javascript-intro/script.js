document.onreadystatechange = function (event) {
    if (document.readyState === 'complete') {
        console.log('Hello from JavaScript')
    }
}

console.log('Script was loaded')