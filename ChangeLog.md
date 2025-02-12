#### v2.1.01
- Bugfix: fehler bei der Gleitzeit berechnung behoben
- metaDaten geändert
- neues Feld: Gewertete Arbeitszeit

#### v2.1.02
- Bugfix: fehler bei der negativen Gleitzeit berechnung behoben

#### v2.1.03
- Bugfix: Gleitzeitberechnung ReWork
- Darstellung der tatsächlichen Zeit angepasst

## v2.2
- Neuer Tab: Wochenarbeitszeit
	- Neues Feature: berechnen der Wochenarbeitszeit
- Update README & ChangeLog
- Anpassungen der MetaDaten in index.html

#### v2.2.01
- Kleinere optische Anpassung im Wochenarbeitszeit-Tab
- Anpassung der MetaDaten

#### v2.2.02
- Bugfix: Beim Reset wird jetzt auch die gewertete Zeit zurückgesetzt

## v2.3
- Arbeitszeitenvorauswahl remake
- Pausenzeitenauswahl remake
- Bugfix: Fehler bei der Berechnung der Gleitzeit behoben (wird jetzt nur noch mit 7.06 als Soll berechnet)
- Neues Feature: Automatische Pausenzeit auswahl
- Neues Feature: Automatische Arbeitszeitenvorauswahl (Hat keinen Effekt auf die Gleitzeit berechnung)
- Neues Feature: Arbeitsende nach gewünschter Gleitzeit ausrechnen
- Neues Feature: Optimales Ende wird angeben (wenigste Arbeitszeit mit maximaler Gleitzeit)
- Anpassung: Bessere Darstellung der Wochenarbeitszeit

## v2.4
- Neues Feature: Gleitzeit pro Woche ausrechnen
	- Neues Feature: Gleitzeit pro Woche ausrechnen, wenn man einen Gleittag genommen hat (funktioniert auch mit mehr als einem Gleittag)
- Neues Feature: Daten bleiben erhalten, wenn man den Tab wechselt
- Changelog Design angepasst
- ReadMe Struktur angepasst
- Beispiel Bild auf v2.4 updated

#### v2.4.1
- Bugfix: Wenn man 6 Stunden Arbeitszeit ausgewählt hat, wurde mit jedem neu laden der Seite die Arbeitszeit jeweils um eine Stunde reduziert
	Wenn man 10 Stunden ausgewählt hat, wurde jeweils um 1 Stunde erhöht
- Bugfix: Gleitzeitfeld kann jetzt nicht mehr leer sein

#### v2.4.2
- Man kann jetzt nicht mehr die Arbeitszeit selbständig auswählen
	- hat mehrere Probleme verursacht
	- war fachlich/praktisch keine sinnvolle Funktion
- Bugfix: wenn man so arbeitet, dass man mehr oder weniger Pause braucht wird jetzt die richtige Zeit angegeben

## v2.5 - 6h Mode
- Neues Feature: Man kann wählen zwischen einem Tag mit 6 Stunden und einem Tag mit 7:06 Stunden
	- Im 6 Stunden Modus kann man auch seine Gleitzeit eintragen
    - Wenn man im 6 Stunden Modus durch Ändern von Ende oder Gleitzeit wieder über die erlaubten 6 Stunden kommt, wird der Modus automatisch beendet
    - Wenn man im 7 Stunden Modus durch Ändern von Ende oder Gleitzeit unter 6 Stunden kommen sollte, aktiviert man automatisch den 6 Stunden Modus
- Bugfix: Man muss nur noch einmal den Rest Button klicken
- Refactoring: Man es gibt jetzt einen Formatter für die Gleitzeitangaben

#### v2.5.1
- Man kann jetzt nicht mehr per Tab in das Pause- und das Arbeitszeitfeld
- Die Gleitzeit pro Woche wird bei Gleittagen jetzt richtig berechnet und angezeigt
- Die Eingaben werden jetzt im LocalStorage gespeichert und einmal pro Tag gelöscht
  - jetzt kann man das Fenster schließen, und wenn man dieselbe Seite am selben Tag wieder aufruft, werden die letzten Eingaben wieder aufgerufen
- Bei der Gleitzeit wird die Zehnerstelle jetzt mit einer 0 Aufgefüllt
- Bugfix: Der Modus wird jetzt beim neuladen automatisch eingestellt gewechselt
- Bugfix: Die Daten werden wirklich aus dem Localstorage gelöscht

#### v2.5.2 - DevOptions
- Neues Feature: DevOptions
  - Es werden neue Tabs angezeigt: aktuelle Version, Testversion, Repo, Restart und Exit (um den Modus wieder zu verlassen)
  - Um in den Modus zu kommen, muss man auf der Konsole "enableDevOptions()" eingeben oder die Seite über einen bestimmten Link aufrufen

#### v2.5.3 - DevOption Icons
- Refactoring: DevOptions werden jetzt als Icons angezeigt
- QoL: Die Seite wird automatisch neu geladen, wenn man den Tab öffnet
  - dadurch sollte der Countdown jetzt auch nach dem Sperren des PCs die richtige Zeit anzeigen
- Bugfix: Der Modus wird jetzt auch gespeichert, wenn man die Seite zum ersten Mal öffnet
  - Beim neuen Laden wird jetzt immer ein Knopf als aktiv angezeigt
- Refactoring: DevOptions die eine Funktion aufrufen, sind jetzt buttons
  - Die Buttons sehen aber aus wie alle anderen Tabs

#### v2.5.4 - Cookies
- Auf Cookies umgestellt
    - Local und SessionStorage Methoden wurden entfernt
    - SameDayCheck entfernt, ist mit Expiring Cookies überflüssig
- Code Refactoring
    - var auf const und let geändert und unnötige Zeilen entfernt
    - destructuring implementiert
    - einige zwischen variablen gelöscht einheitliche benennung (snake_case to camelCase)
    - dzr in dzr und dzrUtils unterteilt
      - dzrUtils sind alle funktionen die nicht direkt auf das html zugreifen müssen
    - getter and calculations simplified, sodass man jetzt über eine const immer auf den aktuellen Wert zugreifen kann

#### v2.5.5 - Testing and Refactoring
- introducing: testing with jest
- neues feature: Gleitzeit über die Pfeiltasten erhöhen und verringern
- weekTimeUtils eingeführt
    - tests für die weekTimeUtils geschrieben
- handling für falsche Formate von FloatArrays
- calculate() code etwas reduziert

#### v2.5.6 - New and Custom DevOptions
- Das Plus bei der Wochenarbeitszeit entfernen
- Man kann jetzt bis zu 3 eigene DevOptions vergeben
    - Man kann aus einer Liste von Icons wählen (es gibt keine eigenen Animationen, nur die standard Icon Animation)
    - Man kann eigene links vergeben (es soll keine eigenen Funktionen geben)
- Neue DevOption: Gleitzeit +14 Minuten setzten
- Quality of Life: DevOption links öffnen jetzt immer in einem neuen Tab
- PopUp Fenster um DevOptions hinzuzufügen
- Wenn ein Button Mittag oder Lunch heißt und der Link ein entsprechendes Format hat, wird er bei jedem laden updated
- Neues Format für den ChangLog eingeführt
- CustomDevOptions lassen sich wieder entfernen
- Einige Deprecated Methoden wurden entfernt
- Man kann jetzt die DevTools per F2 öffnen
    - Öffnen oder schließen, je nach aktuellen Status
- JSDoc für devOptions ergänzt
- Dependencies in die Readme geschrieben
- Bugfix: URL wird komisch angezeigt
- Types in JSDoc eingeführt
    - In den Utils Files und an anderen stellen entsprechende Kommentare ergänzt
- ChangeLog als DevButton ergänzt
- Es können nur noch die benötigten Zeichen in das Floatfeld eingetragen werden
    - Entsprechende Tests ergänzt
- Bugfix: Wenn man die Zahlen aus dem Endzeitfeld löscht, wird nicht mehr automatisch die Zeit berechnet, was früher zu fehlern geführt hat
