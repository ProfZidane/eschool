module.exports =  function (name) {
    let mail = '';
    let date =  new Date().toLocaleDateString();
    let prefixe = "@eschool.net";

    mail = "TEA-" + date + name +  prefixe;
    return mail;

}