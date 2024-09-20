### v2.1.01
- Bugfix: fehler bei der Gleitzeit berechnung behoben
- metaDaten geändert
- neues Feld: Gewertete Arbeitszeit

### v2.1.02
- Bugfix: fehler bei der negativen Gleitzeit berechnung behoben

### v2.1.03
- Bugfix: Gleitzeitberechnung ReWork
- Darstellung der Tatsächlichen Zeit angepasst

### v2.2
- Neuer Tab: Wochenarbeitszeit
	- Neues Feature: berechnen der Wochenarbeitszeit
- Update README & ChangeLog
- Anpassungen der MetaDaten in index.html

### v2.2.01
- Kleinere Optische Anpassung im Wochenarbeitszeit-Tab
- Anpassung der der MetaDaten

### v2.2.02
- Bugfix: Beim Reset wird jetzt auch die Gewertete Zeit zurückgesetzt

### v2.3
- Arbeitszeitenvorauswahl remake
- Pausenzeitenauswahl remake
- Bugfix: Fehler bei der Berechnung der Gleitzeit behoben (wird jetzt nur noch mit 7.06 als Soll berechnet)
- Neues Feature: Automatische Pausenzeit auswahl
- Neues Feature: Automatische Arbeitszeitenvorauswahl (Hat keinen Effekt auf die Gleizeit berechnung)
- Neues Feature: Arbeitsende nach gewünschter Gleitzeit ausrechnen
- Neues Feautre: Optimales Ende wird angeben (wenigste Arbeitszeit mit maximaler Gleitzeit)
- Anpassung: Bessere Darstellung der Wochenarbeitszeit

### v2.4
- Neues Feature: Gleitzeit pro Woche ausrechnen
	- Neues Feature: Gleitzeit pro Woche ausrechnen, wenn man einen Gleittag genommen hat (funktioniert auch mit mehr als einem Gleittag)
- Neues Feautre: Daten bleiben erhalten wenn man den Tab wechselt
- Changelog Design angepasst
- ReadMe Struktur angepasst
- Beispiel Bild auf v2.4 geupdated

## v2.4.1
- Bugfix: Wenn man 6 Stunden Arbeitszeit ausgewählt hat, wurde mit jedem neuladen der Seite die Arbeitszeit jeweils um eine Stunde reduziert
	Wenn man 10 Stunden ausgewählt hat, wurde jeweils um 1 Stunde erhöht
- Bugfix: Gleitzeitfeld kann jetzt nicht mehr leer sein

## v2.4.2
- Man kann jetzt nicht mehr die Arbeitszeit selbständig auswählen
	- hat mehrere Probleme verursacht
	- war fachlich/praktisch keine sinnvolle Funktion
- Bugfix: wenn man so arbeitet, dass man mehr oder weniger Pause braucht wird jetzt die richtige Zeit angegeben

## v2.5
- Neues Feature: Man kann wählen zwischen einem Tag mit 6 Stunden und einem Tag mit 7:06 Stunden
- Bugfix: Man muss nur noch einmal den Rest Button clicken