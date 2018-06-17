var pontos;
var maisProximos;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  background(255);
  frameRate(30);
  textFont("Helvetica");
  textSize(12);

  //step = 0;
  
  var criarNumPontos = 15;
  pontos = new Array(criarNumPontos);
  for (var i = 0; i < criarNumPontos; i++) {
    pontos[i] = createVector(random(1, width-100), random(1, height-100)); 
    // O createVector() é uma função da lib p5 que cria pontos no plano ou no espaço, no nosso caso estamos usando apenas p1 e p2 (x, y) (duas dimensões)
  }
  
  Px = ordPeloX(pontos); // todos os pontos ordenados pelo X
  Py = ordPeloY(pontos); // todos os pontos ordenados pelo Y
  
  maisProximos = CPR(Px, Py); // maisProximos recebe inicialmente o valor de Px e Py e vai sendo reduzido com o retorno dessa função recursiva 
}

//desenhar pontos
function draw() {
  clear();

  for (var i = 0; i < pontos.length; i++) {
    noStroke();
    fill(20, 80, 200);
    ellipse(pontos[i].x, pontos[i].y, 5, 5);
    
    // no texto do desenho os valores dos pontos são arredondados
    noStroke();
    fill(0);
    text(round(pontos[i].x) + ", " + round(pontos[i].y), pontos[i].x + 5, pontos[i].y, 1000, 12);  
  }

  // realcar pontos mais proximos
  stroke(220, 80, 20);
  line(maisProximos[0].x, maisProximos[0].y, maisProximos[1].x, maisProximos[1].y);
  fill(220, 80, 20);
  ellipse(maisProximos[0].x, maisProximos[0].y, 5, 5);
  ellipse(maisProximos[1].x, maisProximos[1].y, 5, 5);
}

function calcularDist(p1, p2) {
  return sqrt(pow(p1.x-p2.x, 2) + pow(p1.y-p2.y, 2));
}

function ordPeloX(P) {  // recebe um vetor de coordenadas P e ordena ele pelo eixo X 
  var temp = P.slice();
  temp.sort(function(p1, p2) {
    return p1.x - p2.x;
  });
  return temp;
}

function ordPeloY(P) {  // recebe um vetor de coordenadas P e ordena ele pelo eixo Y
  var temp = P.slice();
  temp.sort(function(p1, p2) {
    return p1.y - p2.y;
  });
  return temp;
}

function listaPontos(P) {
  for (var i = 0; i < P.length; i++)
    console.log(round(P[i].x) + ", " + round(P[i].y));
}


// função principal, ela divide, conquista e combina
function CPR(Px, Py) { // 
	console.log("Px: ");
	listaPontos(Px);

  // calculo da distância entre pontos quando chega no ponto de parada 3 (O calculo passa a ser na força bruta)
  // o distMin é apenas interno desse if abaixo (para validação das condições)
  if (Px.length == 3) { //caso entre
	  var maisProximosTemp = [Px[0], Px[1]]; // define como mais proximo o ponto 0 com o 1
    var distMin = calcularDist(Px[0], Px[1]); // calcula e define como minima a distancia entre o ponto 0 e o 1
      
    if (calcularDist(Px[1], Px[2]) <= distMin) { //caso entre
      maisProximosTemp = [Px[1], Px[2]]; // define como mais proximo o ponto 1 com o 2
      distMin = calcularDist(Px[1], Px[2]); // calcula e define como minima a distancia entre o ponto 1 e o 2
    }
    else if (calcularDist(Px[0], Px[2]) <= distMin) { //caso entre
      maisProximosTemp = [Px[0], Px[2]]; // define como mais proximo o ponto 0 com o 2
      distMin = calcularDist(Px[0], Px[2]); // calcula e define como minima a distancia entre o ponto 0 e o 2
    }
    return maisProximosTemp; // retorna o par de pontos mais proximos
  }
  
  // calculo da distância entre pontos quando chega no ponto de parada 3 (O calculo passa a ser na força bruta)
  if (Px.length == 2) { //caso entre
    return [Px[0], Px[1]]; // retorna o par de pontos como os mais proximos
  }
  
  // divide P em duas partes no ponto médio pelas coordenadas em X
  console.log("Ponto medio: " + ceil(Px.length/2));
  var ESQ = Px.slice(0, ceil(Px.length/2));
  var DIR = Px.slice(ceil(Px.length/2), Px.length);
  
  console.log("ESQ");
  listaPontos(ESQ); // lista os pontos após a divisão "P" do lado esquerdo (até aqui nao estao ordenados)
  console.log("DIR");
  listaPontos(DIR); // lista os pontos após a divisão "P" do lado direito (até aqui nao estao ordenados)
  
  var esqX = ordPeloX(ESQ);
  var esqY = ordPeloY(ESQ);  
  var dirX = ordPeloX(DIR);
  var dirY = ordPeloY(DIR);
  
  console.log("");
  
  var proxEsq = CPR(esqX, esqY);  // (esqX, esqY) chama recursivamente a função CPR() e define o par de pontos mais proximos na esquerda
  console.log("Proximos esquerda:");
  listaPontos(proxEsq); 
  
  console.log("+");
  
  var proxDir = CPR(dirX, dirY); // (dirX, dirY) chama recursivamente a função CPR() e define o par de pontos mais proximos na direita
  console.log("Proximos direita:");
  listaPontos(proxDir);
  
  // calculo do delta
  var delta = min((calcularDist(proxEsq[0], proxEsq[1])), (calcularDist(proxDir[0], proxDir[1]))); // passa pra delta o valor minimo
  console.log("delta: " + delta);
  var xstar = ESQ[ESQ.length-1].x; // independente que seja ESQ ou DIR funciona pois o valor do x central ja é setado dessa forma quando feita a divisão
  
  // cria um vetor de pontos S definindo um X central e põe o delta envolta dele (x = xstar)
  var S = new Array();
  for (var i = 0; i < Px.length; i++) {
    if (abs(Px[i].x - xstar) <= delta) // abs() retorna o valor absoluto do numero ex: 4-10 = 6 ;) 
      S.push(Px[i]); //remove o ultimo elemento do vetor Px e retorna ele
  }
  var Sy = ordPeloY(S);
  
  console.log("Sy: ");
  listaPontos(Sy);
  
  var disMinS = delta;
  var s1;
  var s2;
  for (var i = 0; i < Sy.length; i++) {
    for (var j = i+1; j < Sy.length; j++) {
      if (calcularDist(Sy[i], Sy[j]) < disMinS) {
        s1 = Sy[i];
        s2 = Sy[j];
        disMinS = calcularDist(Sy[i], Sy[j]);
      }
    }
  }
  
  if (disMinS < delta) {
    console.log("[s1, s2]: ");
    listaPontos([s1, s2]);
    return [s1, s2];
  }
  else if (calcularDist(proxEsq[0], proxEsq[1]) < calcularDist(proxDir[0], proxDir[1]))
    return proxEsq;
  else
    return proxDir;
  
  return null;
}
