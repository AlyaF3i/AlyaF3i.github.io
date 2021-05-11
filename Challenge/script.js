function calculateDistance() {
    let temp = toMeter(ID("fromDn") * 1, ID("Fromd"));
    let num = FromMeter(temp, ID("tod"));
    document.getElementById("toDn").value = `${num}`;
}
function ID(string) {
    return document.getElementById(string).value;
}
function FromMeter(num, name) {
    if (name == "cm")
        return num * 100;
    if (name === "m")
        return num;
    if (name === "km")
        return num / 1000;
    if (name === "ml")
        return num/1609.344;
    if (name === "yard")
        return num * 1.0936133;
    if (name === "ft")
        return num * 3.28;
    if (name === "inch")
        return num * 39.37;
}
function toMeter(num, name) {
    if (name == "cm")
        return num / 100;
    if (name === "m")
        return num;
    if (name === "km")
        return num * 1000;
    if (name === "ml")
        return 1609.344 * num;
    if (name === "yard")
        return num / 1.0936133;
    if (name === "ft")
        return num / 3.28;
    if (name === "inch")
        return num / 39.37;
}
function calculateTemp() {
    let temp = toCelsius(ID("fromTn") * 1, ID("Fromt"));
    let num = FromCelsius(temp, ID("tot"));
    document.getElementById("toTn").value = `${num}`;
}
function ID(string) {
    return document.getElementById(string).value;
}
function FromCelsius(num, name) {
    if (name == "f")
        return (num) * 9 / 5 + 32;
    else if (name === "k")
        return num + 273.15;
    else
        return num;

}
function toCelsius(num, name) {
    if (name == "f")
        return (num - 32) * 5 / 9;
    else if (name === "k")
        return num - 273.15;
    else
        return num;

}