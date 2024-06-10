const tipo_de_busqueda=sessionStorage.getItem("B") || -1;
if(tipo_de_busqueda==-1){window.location.href="Menu.html";}

function normalize(palabra){
  return palabra.replace(/[ \-()'\"$:¡¿?,;!\.\r]/g,'').toUpperCase();
}

function parsear(event){
    var input=event.target;
    var lector=new FileReader();
    lector.onload=function(){
      var texto=lector.result;
      let BASE=[];
      let DICT={};
      let DICT2=[[],[]];

      BASE=texto.split("\n");
      for(linea in BASE){
          BASE[linea]=BASE[linea].split(" ");
      }

      if(tipo_de_busqueda==0){
        sessionStorage.setItem("DATOS",JSON.stringify(BASE));
      }else if(tipo_de_busqueda==1){
        for(linea in BASE){
          for(palabra in BASE[linea]){
            if(DICT[normalize(BASE[linea][palabra])]
            ==undefined){DICT[normalize(BASE[linea][palabra])]=[0,[]];}
            DICT[normalize(BASE[linea][palabra])][0]++;
            DICT[normalize(BASE[linea][palabra])][1].push(parseInt(linea)+1);
          }
        }
        sessionStorage.setItem("DATOS",JSON.stringify(DICT));
      }else if(tipo_de_busqueda==2){
        for(linea in BASE){
          for(palabra in BASE[linea]){
            const indice=DICT2[0].indexOf(normalize(BASE[linea][palabra]));
            if(indice==-1){
              DICT2[0].push(normalize(BASE[linea][palabra]));
              DICT2[1].push([parseInt(linea)+1]);
            }else{
              DICT2[1][indice].push(parseInt(linea)+1);
            }
          }
        }
        sessionStorage.setItem("DATOS",JSON.stringify(DICT2));
      }
    }
    lector.readAsText(input.files[0]);
  }

function buscar(){
    
    let input=document.getElementById("ingresador").value;
    if(normalize(input)===""){return;}

    // Búsqueda Bruta
    if(tipo_de_busqueda==0){
      const start=performance.now();
      let BASE=JSON.parse(sessionStorage.getItem("DATOS")) || -1;
      if(BASE==-1){return alert("RECUERDA CARGAR EL DOCUMENTO!");}
      let lineas=[];
      let ret="";
      for(linea in BASE){
        for(palabra in BASE[linea]){
          if(normalize(BASE[linea][palabra])===
          normalize(input)){lineas.push(parseInt(linea)+1);}}}
      let cantidad=lineas.length;
      lineas=[...new Set(lineas)];
      for(linea in lineas){ret+=String(lineas[linea])+" ";}
      if(lineas.length==0){return alert(`La palabra "${normalize(input)}" no fue encontrada`);}
      const end=performance.now();
      return Abrir(normalize(input),cantidad,ret,(end-start)/1000);
    }
    // Búsqueda Diccionario
    else if(tipo_de_busqueda==1){
      const start=performance.now();
      let DICT=JSON.parse(sessionStorage.getItem("DATOS")) || -1;
      if(DICT==-1){return alert("RECUERDA CARGAR EL DOCUMENTO!");}
      let ret="";
      if(DICT[normalize(input)]==undefined){return alert(`La palabra "${normalize(input)}" no fue encontrada`);}
      let lineas=[...new Set(DICT[normalize(input)][1])];
      cantidad=DICT[normalize(input)][0];
      for(linea in lineas){ret+=String(lineas[linea])+" ";}
      const end=performance.now();
      return Abrir(normalize(input),cantidad,ret,(end-start)/1000);
    }
    // Búsqueda Diccionario Personal
    else if(tipo_de_busqueda==2){
      const start=performance.now();
      let DICT2=JSON.parse(sessionStorage.getItem("DATOS")) || -1;
      if(DICT2==-1){return alert("RECUERDA CARGAR EL DOCUMENTO!");}
      let ret="";
      const posicion=DICT2[0].indexOf(normalize(input));
      if(posicion==-1){return alert(`La palabra "${normalize(input)}" no fue encontrada`);}
      let cantidad=DICT2[1][posicion].length;
      let lineas=[...new Set(DICT2[1][posicion])];
      for(linea in lineas){ret+=String(lineas[linea])+" ";}
      const end=performance.now();
      return Abrir(normalize(input),cantidad,ret,(end-start)/1000);
    }
  }

  function Abrir(palabra,cantidad,paginas,tiempo){
    const pop=document.getElementById("pop");
    const resultado=document.getElementById("resultado");
    const pags=document.getElementById("pags");
    const time=document.getElementById("time");
    pags.value="";
    resultado.innerText=`La palabra ${palabra} aparece ${cantidad} veces en el texto ingresado. Se puede observar en las siguientes líneas:`
    pags.value=paginas;
    time.innerText=tiempo;
    pop.style.transform="scale(1);";
    pop.style.transform="translate(25%)";
  }
  function Cerrar(){
    const pop=document.getElementById("pop");
    pop.style.transform="scale(0)";
  }