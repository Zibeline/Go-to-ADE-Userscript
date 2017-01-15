// ==UserScript==
// @name Go to ADE
// @namespace go_to_ade.user.js
// @description Ajoute un lien direct pour consulter son horaire sur ADE depuis les sites de l'UCL
// @version 1.2
// @author DenisM
// @updateURL https://raw.githubusercontent.com/Zibeline/Go-to-ADE-Userscript/master/go_to_ade.user.js
// @homepage https://github.com/Zibeline/Go-to-ADE-Userscript
// @include        *://moodleucl.uclouvain.be/my/*
// @include        *://www.uclouvain.be/onglet_etudes.html?cmp=cmp_formations.html*
// @include        *://moodleucl.uclouvain.be/course/view.php*
// @grant        none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// ==/UserScript==

var ade = {
	login    : "etudiant",
	password : "student"
};

var entries = {
	moodle_home: {
		min_url       : 'moodleucl.uclouvain.be/my/',
		course_list   : ".block_course_list .unlist a",
		attribute     : 'title',
		link_position : ".block_course_list .title"
	},
	bureau_virtuel: {
		min_url       : 'www.uclouvain.be/onglet_etudes.html?cmp=cmp_formations.html',
		course_list   : ".composant-corps table td",
		attribute     : 'innerHTML',
		link_position : "#onglets ul",
		link_container: $('<li style="margin-left: 150px;"></li>')
	},
	moodle_cours: {
		min_url       : 'moodleucl.uclouvain.be/course/view.php',
		course_list   : "title",
		attribute     : 'innerHTML',
		link_position : "#page-navbar"
	}
};

var liste = ""; // Contiendra la liste des cours séparés par des virgules

var actual_url = window.location.href;
var entry;
// On parcours les entries pour savoir dans laquelle on est (en comparant min_url avec l'url actuelle)
// et on récupère l'entry ou l'on est dans la variable entry
$.each(entries, function (key, entr) {
	if (actual_url.indexOf(entr.min_url)>-1) {
    	entry = entr;
	}
});

try {
	var course_list = $(entry.course_list); // récupère la liste des elems qui contiennent chacun un code de cours
	for (var i = 0; i < course_list.length; i++) { // parcours cette liste
		var title = course_list[i][entry.attribute]; // récupère un string qui contient le code du cours
		var code = ""; // contiendra le code du cours
  
      	// Essaie de récupérer le code du cours avec 5 lettres (LSINF1234)
		var regex = /.*([A-Z]{5}[0-9]{4}).*/gi;
		var arr = regex.exec(title);
      
		if (arr!=null) { // Si on a trouvé avec 5 lettres, on récupère le code
			code = arr[1];
		}
		else { // Si on a pas trouvé avec 5 lettres
          	// On essaie avec 4 lettres
			regex = /.*([A-Z]{4}[0-9]{4}).*/gi;
			arr = regex.exec(title);
			if (arr!=null) code = arr[1]; // Si on a trouvé avec 4 lettres, on récupère le code
		}
      
		if (code !="") { // Si on a trouvé un code (avec 4 ou 5 lettres)
			if (liste!="") liste += ","; // on ajoute une virgule uniquement si il y a déjà un code devant
			liste += code; // on ajoute le code dans la liste
		}
	}

  	// On crée l'url vers ADE
	var url = 'http://horairev6.uclouvain.be/direct/index.jsp?displayConfName=webEtudiant&showTree=false&showOptions=false&login='+ade.login+'&password='+ade.password+'&projectId=16&code='+liste;
  
  	var link = $('<a href="'+url+'" target="_blank">Voir mes cours sur ADE</a>');
  
  	if (typeof(entry.link_container)!=='undefined') { // si il faut emballer le lien dans un élément, on le fais ici
		link = entry.link_container.append(link);
    }
  	// On place un lien vers ADE
	$(entry.link_position).append(link);
	console.log("Go to ADE : a terminé sans erreurs =D");
}
catch(err) {
	console.log("Go to ADE : ça a foiré :/");
}