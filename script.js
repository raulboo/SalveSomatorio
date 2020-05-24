// document.getElementbyId("qtQuestoes").oninput = function () {
//     if (this.value.length > 4) {
//         this.value = this.value.slice(0,4);
//     }
// }

function updateQuestions(){
  // var resulting_span = document.createElement("span");
  //
  // for (i = 0; i < document.getElementById("qtQuestoes").value; i++) {
  //   var question = document.createElement("div");
  //   var alternatives = document.createElement("div");
  //
  //   var text_label = document.createElement("label");
  //   var x = document.createTextNode(`Questão ${i + 1}`);
  //   text_label.appendChild(x);
  //
  //   var gabarito = document.createElement("input");
  //   gabarito.setAttribute("type", "number");
  //   gabarito.setAttribute("id", `gabarito${i}`);
  //
  //   var ate_qual = document.createElement("select");
  //   ate_qual.setAttribute("id", `ate_qual${i}`);
  //
  //   for (j = 0; i < 7; i++) {
  //     var check_box = document.createElement("input");
  //     check_box.setAttribute("type", "checkbox");
  //     check_box.setAttribute("name", `alternative${j}`);
  //
  //     var check_label = document.createElement("label");
  //     var t = document.createTextNode(Math.pow(2, j));
  //     check_label.appendChild(t);
  //     check_box.appendChild(check_label);
  //
  //     alternatives.appendChild(check_box);
  //
  //     var option = document.createElement("option");
  //     option.setAttribute("value", j);
  //     var y = document.createTextNode(Math.pow(2, j));
  //     option.appendChild(y);
  //     ate_qual.appendChild(option);
  //   }
  //
  //   question.appendChild(alternatives);
  //   question.appendChild(gabarito);
  //   question.appendChild(ate_qual);
  //
  //   question.setAttribute("id", `q${i}`);
  //   resulting_span.appendChild(question);
  // }
  //
  //
  // //x.setAttribute("type", "number");
  // //x.setAttribute("value", "12345");
  // document.body.appendChild(resulting_span);

  var resulting_span = document.createElement("span");
  resulting_span.setAttribute("id", "questoes");

  var q_model = document.getElementById("question_model");

  for (i = 0; i < document.getElementById("qtQuestoes").value; i++) {
    var new_question = q_model.cloneNode(true)
    new_question.hidden = false
    new_question.getElementsByClassName("question_label")[0].innerHTML = `Questão ${i+1}`;
    resulting_span.appendChild(new_question)
  }

  var ready_button = document.createElement("button");
  ready_button.innerHTML = "Corrigir"
  ready_button.setAttribute("id", "ready_button")
  ready_button.setAttribute("onclick", "corrigir()")
  resulting_span.appendChild(ready_button)

  document.getElementById("questoes").remove();
  document.body.appendChild(resulting_span);
}

function corrigir(){
  for (question of document.getElementById("questoes").getElementsByClassName("question")){
    var given_answer = [];

    // Ja vem organizado em ordem ---v
    for (checkbox of question.getElementsByClassName("alternative")){
      given_answer.push(checkbox.checked);
    }

    // Caso não tenha valor -> default 0
    var gabarito_puro = question.getElementsByClassName("gabarito")[0].value;
    var right_answer = ((gabarito_puro ? gabarito_puro : 0) >>> 0).toString(2).split("").reverse().map(a => !!+a);

    // Número de Proposições
    var np = parseInt(question.getElementsByClassName("ate_qual")[0].value) + 1
    given_answer = clip_to_size(given_answer, np, false)
    right_answer = clip_to_size(right_answer, np, false)

    // Numero Total de Proposições Corretas
    var ntpc = right_answer.reduce(((acc, cur) => acc + (cur ? 1 : 0)), 0)

    // Útil depois para estilizar
    var correctly_answered = (new Array(np)).fill().map((_, i) => given_answer[i] === right_answer[i])

    // Numero de Proposições Corretas consideradas Corretas pelo Candidato
    var npc = given_answer.reduce(((acc, cur, idx) => acc + (cur ? (right_answer[idx] ? 1 : 0) : 0)), 0)

    // Numero de Proposições Incorretas consideradas Corretas pelo Candidato
    var npi = given_answer.reduce(((acc, cur, idx) => acc + (cur ? (right_answer[idx] ? 0 : 1) : 0)), 0)

    // Pontuação = [NP - (NTPC - (NPC - NPI))]/NP se NPC > NPI, senão P = 0
    var p = (npc > npi) ? ((np - (ntpc - (npc - npi)))/np) : 0.0

    question.getElementsByClassName("pontos_questao")[0].innerHTML = p.toFixed(2)

    console.log(`NP = ${np} ; NTPC = ${ntpc} ; NPC = ${npc} ; NPI = ${npi} ; P = ${p}`)



    //console.log(((gabarito_puro ? gabarito_puro : 0) >>> 0).toString(2).split("").reverse().map(a => !!+a))
    //console.log(((gabarito_puro ? gabarito_puro : 0) >>> 0).toString(2).split().reverse().map(a => !!+a));
    //console.log(given_answer);
    //console.log(right_answer);

  }
}

// Returns an array
function clip_to_size(arr, size, default_value_to_fill){
  if (arr.length == size){return arr}
  else if (arr.length > size){return arr.slice(0, size)}
  else if (arr.length < size){return arr.concat((new Array(size - arr.length)).fill(default_value_to_fill))}
}
