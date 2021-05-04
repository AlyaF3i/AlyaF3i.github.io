function calculate(){
        let equation=filterEquation(document.getElementById('equation').value);
        let h=document.getElementById('h').value*1;
        let Mainy=document.getElementById('y0').value*1;
        let iterations=document.getElementById('iterations').value*1;
        let Maint=0;
        let y=Mainy;
        let t=Maint;
        let solution=[];
        for(let i=0;i<=iterations;i++){
            f1=eval(equation);
            t+=(h/2);
            y+=((h*f1)/2);
            f2=eval(equation);
            y=Mainy+((h*f2)/2);
            f3=eval(equation);
            t+=(h/2);
            y=Mainy+(h*f3);
            f4=eval(equation);
            solution.push([i,Maint,Mainy,f1,f2,f3,f4]);
            Maint+=h;
            Mainy+=((h*(f1+2*f2+2*f3+f4))/6);
        }
        let output=["<tr><th>k</th><th>t<sub>k</sub></th><th>y<sub>k</sub></th><th>f1</th><th>f2</th><th>f3</th><th>f4</th></tr>"];
        let temp="";
        for(let i=0;i<=iterations;i++){
            temp="<tr>";
            for(let j=0;j<solution[i].length;j++){
                temp+="<td>"+solution[i][j]+"</td>";
            }
            temp+="</tr>";
            output.push(temp);
        }
        document.getElementById("solution").innerHTML="";
        output.forEach(a => {
            console.log(a);
            document.getElementById("solution").innerHTML+=a;
        });
        
    
    }

function integration(){
    let method=document.getElementById("method").value*1;
    let equation=filterEquation(document.getElementById("equation").value);
    console.log(equation);
    let b=document.getElementById("b").value*1;
    let a=document.getElementById("a").value*1;
    let output;
    switch(method){
        case 0: output=Newton();
        break;
        case 1: output=Simpson();
        break;
        case 2: output=Simpson83();
        break;
        case 3: output=Boole();
    }
    document.getElementById("solution").innerHTML=output;
    function Newton(){
        h=b-a;
        let x=a;
        let f0=parseFloat(eval(equation));
        console.log(f0);
        x+=h;
        let f1=parseFloat(eval(equation));
        console.log(f1);
        let final=(h/2)*(f0+f1);
        let output=`<h1>h= b-a = ${b}-${a}=${h}</h1>
                    <h1><span style="font-size:60%;"><sup>h</sup> &#8260; <sub>2</sub></span>(f<sub>0</sub>+f<sub>1</sub>)=</h1>
                    <h1>=<span style="font-size:60%;"><sup>${h}</sup> &#8260; <sub>2</sub></span>( f(${a})+f(${b}) )</h1>
                    <h1>=<span style="font-size:60%;"><sup>${h}</sup> &#8260; <sub>2</sub></span>( ${f0}+${f1} )</h1>
                    <h1>= ${final}</h1>`;
        return output;
    }
    function Simpson(){
        h=(b-a)/2;
        let x=a;
        let f0=eval(equation);
        x+=h;
        let f1=eval(equation);
        x+=h;
        let f2=eval(equation);
        let final=(h/3)*(f0+(4*f1)+f2);
        let output=`<h1>h= <span style="font-size:60%;"><sup>b-a</sup> &#8260; <sub>2</sub></span>= <span style="font-size:60%;"><sup>${b}-${a}</sup> &#8260; <sub>2</sub></span> = ${h}</h1>
                    <h1><span style="font-size:60%;"><sup>h</sup> &#8260; <sub>3</sub></span>(f<sub>0</sub>+4f<sub>1</sub>+f<sub>2</sub>)=</h1>
                    <h1><span style="font-size:60%;"><sup>${h}</sup> &#8260; <sub>3</sub></span>( f(${a})+4f(${a+h})+f(${b}) )</h1>
                    <h1><span style="font-size:60%;"><sup>${h}</sup> &#8260; <sub>3</sub></span>( ${f0}+(4)${f1}+${f2} )</h1>
                    <h1>= ${final}</h1>`;
        return output;
    }
    function Simpson83(){
        h=(b-a)/3;
        let x=a;
        let f0=eval(equation);
        x+=h;
        let f1=eval(equation);
        x+=h;
        let f2=eval(equation);
        x+=h;
        let f3=eval(equation);
        let final=(h*3/8)*(f0+(3*f1)+(3*f2)+f3);
        let output=`<h1>h= <span style="font-size:60%;"><sup>b-a</sup> &#8260; <sub>3</sub></span>= <span style="font-size:60%;"><sup>${b}-${a}</sup> &#8260; <sub>3</sub></span> = ${h}</h1>
                    <h1><span style="font-size:60%;"><sup>3h</sup> &#8260; <sub>3</sub></span>(f<sub>0</sub>+3f<sub>1</sub>+3f<sub>2</sub>+f<sub>3</sub>)=</h1>
                    <h1><span style="font-size:60%;"><sup>${h*3}</sup> &#8260; <sub>8</sub></span>( f(${a})+3f(${a+h})+3f(${b-h})+f(${b}) )</h1>
                    <h1><span style="font-size:60%;"><sup>${h*3}</sup> &#8260; <sub>8</sub></span>( ${f0}+(3)${f1}+(3)${f2}+${f3} )</h1>
                    <h1>= ${final}</h1>`;
        return output;
    }
    function Boole(){
        console.log("hi");
        h=(b-a)/4;
        let x=a;
        let f0=eval(equation);
        x+=h;
        let f1=eval(equation);
        x+=h;
        let f2=eval(equation);
        x+=h;
        let f3=eval(equation);
        x+=h;
        let f4=eval(equation);
        let final=(h*2/45)*((7*f0)+(32*f1)+(12*f2)+(32*f3)+(7*f4));
        let output=`<h1>h= <span style="font-size:60%;"><sup>b-a</sup> &#8260; <sub>4</sub></span>= <span style="font-size:60%;"><sup>${b}-${a}</sup> &#8260; <sub>4</sub></span> = ${h}</h1>
                    <h1><span style="font-size:60%;"><sup>2h</sup> &#8260; <sub>45</sub></span>(7f<sub>0</sub>+32f<sub>1</sub>+12f<sub>2</sub>+32f<sub>3</sub>+7f<sub>4</sub>)=</h1>
                    <h1><span style="font-size:60%;"><sup>${h*2}</sup> &#8260; <sub>45</sub></span>( 7f(${a})+32f(${a+h})+12f(${a+2*h})+32f(${b-h})+7f(${b}) )</h1>
                    <h1><span style="font-size:60%;"><sup>${h*2}</sup> &#8260; <sub>45</sub></span>( (7)${f0}+(32)${a+h}+(12)${a+2*h}+(32)${b-h}+(7)${b} )</h1>
                    <h1>= ${final}</h1>`;
        return output;
    }
}
function filterEquation(equ){
    equ=equ.replace(" ","");
    ["cos", "sin", "tan","cosh","sinh","tanh"].forEach(a=>{
        let b="Math."+a;
        equ=equ.replace(a,b);
    });
    equ=equ.replace("^","**");
    return equ;
}
function Change(){
    let courses=document.forms[0].elements['CoursesNum'].value;
    Hide();
    for(let i=1;i<=courses;i++){
        let n="row"+i;
        document.getElementById(n).style.visibility="visible";
    }
}
function Hide(){
    for(let i=2;i<=7;i++){
        let n="row"+i;
        document.getElementById(n).style.visibility="hidden";
    }
}
function Calc(){
    let courses=document.forms[0].elements['CoursesNum'].value*1;
    console.log(courses);
    sum=0;
    hours=0;
    for(let i=1;i<=courses;i++){
        let n="m"+i;
        let temp=(document.forms[0].elements[n].value*1.0);
        console.log(`${temp}`);
        n="w"+i;
        let a=(temp*document.forms[0].elements[n].value);
        //console.log(`${a}`);
        sum+=a;
        hours+=(document.forms[0].elements[n].value*1.0);
    }
    let GPA=sum/hours;
    document.getElementById("output").innerHTML="  Your GPA is:  "+GPA;
}