function change() {
    for (var i = 1; i < 10; i++) {
        j = (i * 10) + "";
        i = i + "";
        document.getElementById(i).type = "hidden";
        document.getElementById(j).type = "hidden";
    }
    let amount = document.getElementById("amount").value;
    for (var i = 1; i <= amount; i++) {
        j = (i * 10) + "";
        i = i + "";
        document.getElementById(i).type = "number";
        document.getElementById(j).type = "number";
    }
}
function calc() {
    if(document.getElementById("discrete").style.display==="block"){
        discrete();
    }else if(document.getElementById("binomial").style.display==="block"){
        binomial();
    }else if(document.getElementById("poisson").style.display==="block"){
        poisson();
    }
}
function discrete(){
    let num = document.getElementById("amount").value;
    let x=[];
    let fx=[];
    let mean=0;
    let Variance=0;
    for(let i=1;i<=num;i++){
        let temp=i+'0';
        x.push(document.getElementById(i+"").value);
        fx.push(document.getElementById(temp).value);
        mean+=(x[i-1]*fx[i-1]);
        Variance+=(x[i-1]**2*fx[i-1]);
    }
    Variance-=Math.pow(mean,2);
    let StanderDeviation=Math.sqrt(Variance);
    let output=`Mean=${mean}<br><br>Variance=${Variance}<br><br>Stander Deviation=${StanderDeviation}`;
    document.getElementById("discrete").innerHTML=output;
}
function binomial(){
    let finalAnswer;
    let num=document.getElementById("sign").value*1;
    let p=document.getElementById("p").value*1;
    let trial=document.getElementById("trials").value*1;
    let Px=document.getElementById("BinoNumber").value*1;
    let sign;
    switch(num){
        case 0: finalAnswer=Calc(Px+1,trial,p,trial);
            sign=">";
            break;
        case 1: finalAnswer=Calc(Px,trial,p,trial);
            sign="≥";
            break;
        case 2: finalAnswer=Calc(0,Px-1,p,trial);
            sign="<";
            break;
        case 3: finalAnswer=Calc(0,Px,p,trial);
            sign="≤";
            break;
        default:
            finalAnswer=C(trial,Px)*p**Px*(1-p)**(trial-Px);
            sign="=";
    }
    let output=`<h4>P(x ${sign} ${Px})=${finalAnswer}</h4>`;
    document.getElementById("answer").innerHTML=output;
    



    function Calc(from,to,p,trial){
        let q=1-p;
        let out=0.0;
        for(let i=from;i<=to;i++){
            let CC=C(trial,i);
            //console.log(`trial:${trial}, i:${i}, p:${p}, q:${q}, C: ${CC}`);
            let Tempo=(CC*p**i*q**(trial-i));
            out+=Tempo;
        }
        return out;
    }
    function C(a,b){
        //a!/(b!(a-b)!)
        return factorial(a)/(factorial(b)*(factorial(a-b)));
    }
}
function poisson(){
    let finalAnswer;
    let num=document.getElementById("PoissonSign").value*1;
    let Mean=document.getElementById("PoissonMean").value*1;
    //let trial=document.getElementById("trials").value*1;
    let Px=document.getElementById("PoissonNumber").value*1;
    let sign;
    switch(num){
        case 0: finalAnswer=1-PoissonCalc(0,Px,Mean);
            sign=">";
            break;
        case 1: finalAnswer=1-PoissonCalc(0,Px-1,Mean);
            sign="≥";
            break;
        case 2: finalAnswer=PoissonCalc(0,Px-1,Mean);
            sign="<";
            break;
        case 3: finalAnswer=PoissonCalc(0,Px,Mean);
            sign="≤";
            break;
        default:
            finalAnswer=(Math.exp(Mean*-1)*Mean**Px)/(factorial(Px));
            sign="=";
    }
    let output=`<h4>P(x ${sign} ${Px})=${finalAnswer}</h4>`;
    document.getElementById("answer").innerHTML=output;
    function PoissonCalc(from,to,innerMean){
        let out=0.0;
        for(let i=from;i<=to;i++){
            let Tempo=(Math.exp(innerMean*-1)*innerMean**i)/(factorial(i));
            out+=Tempo;
        }
        return out;
    }
}
function show(id) {
    ["discrete", "binomial", "poisson"].forEach(e => document.getElementById(e).style.display = "none");
    document.getElementById(id).style.display = "block";
    document.getElementById("answer").innerHTML="";
}
function factorial(n){
    if(n<2)
        return 1;
    return n*factorial(n-1);
}