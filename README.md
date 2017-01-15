# Go to ADE Userscript

Go to ADe est un Userscript qui permets d'ajouter un lien sur certains sites de l'UCL qui renvoie vers ADE pour directement consulter son horaire sur ADE.

## Installation

Pour l'installer, il suffit d'ajouter le script dans un gestionnaire de script utilisateur installé dans son navigateur.

## Sites actuellement supportés

Pour l'instant, le script ajoute un lien sur les pages suivantes :

###Page d'accueil moodle (moodleucl.uclouvain.be/my/)

Le lien sera ajouté en haut de la boite qui contient la liste des cours, sur base des codes de cours trouvés dans cette liste

###Page du bureau virtuel des cours d'une année (uclouvain.be/onglet_etudes.html?cmp=cmp_formations.html)

Le lien sera ajouté en haut de la page parmis les différents onglets.

## Ajouter un nouveau site

On peut facilement étendre le code pour qu'il prenne en charge d'autres pages de l'ucl. Pour cela, quelques manipulations à faire.

### Ajouter l'url dans les metadata du script

```javascript
@include        *://moodleucl.uclouvain.be/my/*
```
### Ajouter une nouvelle entrée dans le tableau entries

Exemple de l'entrée pour la page d'accueil de moodle :
```javascript
moodle_home: {
	min_url       : 'moodleucl.uclouvain.be/my/',
    course_list   : ".block_course_list .unlist a",
    attribute     : 'title',
    link_position : ".block_course_list .title"
},
```
* `min_url` : url minimale qui doit se retrouver dans l'url actuelle (semblable à ce qu'on a ajouté dans les metadata du script)
* `course list` : le contenu de se paramètre va permettre de sélectionner tous les éléments HTML qui contiennent les codes de cours. Par exemple sur moodle, tous les codes de cours sont trouvables les balises `a` qui se trouvent dans l'objet de classe `unlist`. Ce paramètre va être passé dans une requête jQuery `$(course_list)` pour récupérer tous ces éléments.
* `attribute` : définis ou se trouvent les codes des cours dans claque élément sélectionné via la paramètre précédent. Par exemple sur moodle, il se trouve dans l'attribut `title` des liens.
* `link_position` : ce paramètre définis l'endroit ou il faut ajouter le lien vers ADE. En gros, ce paramètre va être utilisé ainsi `$(link_position).append('<a>Liens vers ADE</a>')`.
* `link_container` (facultatif) : on peut également ajouter un 5e paramètre qui définis une balise dans laquelle ajouter le lien avant de l'ajouter à la position définie par la paramètre précédent. Cela permets par exemple de le mettre en forme. Exemple pour le bureau virtuel : `link_container: $('<li style="margin-left: 150px;"></li>')` : le lien va d'abord être ajouté dans un `<li>` avant d'être placé sur la page.

## Fonctionnement

Le fonctionnement de ce script est assez simple.

* On compare l'url actuelle avec les `min_url` de toutes les entries (pour définir comment on va pouvoir récupérer les codes des cours, ...)
* On va ensuite récupérer tous les objets qui contiennent des codes de cours (sur base du paramètre `course_list`)
* Pour chacun de ces objets, on va récupérer le contenu de l'attribut dans lequel se trouve le code du cours (défini par la paramètre `attribute`)
* On va appliquer une expression régulière sur cette chaine de caractères (on essaye d'abord avec 5 lettres pour des codes du type LSINF1234 puis si on ne trouve rien on essaie avec 4 lettres pour des codes du type SINF1234)
* Si on a trouvé un code valable, on l'ajoute dans la liste des cours
* Une fois qu'on a récupéré tous les codes de cours on crée l'url vers ADE et le lien
* Si le lien doit être ajouté dans un autre élément (spécifié dans le paramètre `link_container`) on place le lien dans cet élément
* Pour finir on place le lien ou éventuellement l'élément dans lequel on doit le place au bon endroit dans la page (spécifié dans le paramètre `link_position`)


## To do

* Prendre en charge les pages d'un cours spécifique sur moodle
* Prendre en charge les pages sur le site UCL qui décrivent un cours (ou un programme d'études)