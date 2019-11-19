let currentWallet = null
var app = {
    initialize: function() {
        console.log('initializing scanner page')
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

       // var url_string = "http://www.example.com/t.html?a=1&b=3&c=m2-m3-m4-m5"; //window.location.href
        const url = new URL(window.location.href);
        currentWallett = url.searchParams.get("wallet");
        console.log("wallet",currentWallet)
    },
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        window.QRScanner.prepare(onDone); // show the prompt

        document.querySelector("#prepare").addEventListener("touchend", function() {
            window.QRScanner.prepare(onDone); // show the prompt
        });

       document.querySelector("#show").addEventListener("touchend", function() {
           console.log('show')
            window.QRScanner.show();
        });

        document.querySelector("#scan").addEventListener("touchend", function() {
            window.QRScanner.scan(displayContents);
        });

        document.querySelector("#hide").addEventListener("touchend", function() {
            console.log('hid/destroy')
            window.QRScanner.destroy();
            //window.QRScanner.hide();
          //  document.location.href='index.html'
        });


        function onDone(err, status){
            if (err) {
                // here we can handle errors and clean up any loose ends.
                console.error(err);
            }
            if (status.authorized) {
                console.log('authorized')
                // W00t, you have camera access and the scanner is initialized.
                // QRscanner.show() should feel very fast.
                window.QRScanner.show();
                window.QRScanner.scan(displayContents);
              //  window.QRScanner.scan(displayContents);
            } else if (status.denied) {
                // The video preview will remain black, and scanning is disabled. We can
                // try to ask the user to change their mind, but we'll have to send them
                // to their device settings with `QRScanner.openSettings()`.
            } else {
                // we didn't get permission, but we didn't get permanently denied. (On
                // Android, a denial isn't permanent unless the user checks the "Don't
                // ask again" box.) We can ask again at the next relevant opportunity.
            }
        }

        function displayContents(err, text){
            if(err){
                // an error occurred, or the scan was canceled (error code `6`)
            } else {
                // The scan completed, display the contents of the QR code:
                console.log(text);
                window.QRScanner.destroy();
                localStorage.setItem('qrCode',text)
                document.location.href='index.html';
            }
        }
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
