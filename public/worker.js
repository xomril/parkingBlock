self.addEventListener("push", e => {
    const data = e.data.json();
    console.log("hi! Push Recieved...");
    self.registration.showNotification(data.title, {
        body: "Fireblocked push notification" ,
        icon: "https://hasamti.herokuapp.com/images/192.png"
    });


});


function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}