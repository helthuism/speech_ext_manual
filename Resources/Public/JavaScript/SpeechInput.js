define(['jquery'], function ($) {
    'use strict';

    try {
        // Variablen initialisieren
        var recognizing = false;
        var infiniteMode = false; // Zustand für den "unendlich" Modus
        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        var recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.lang = 'de-DE';

        // Spracherkennung starten
        function startSpeechRecognition() {
            if (!recognizing) {
                recognition.start();
                recognizing = true;
                console.log("Speech recognition started.");
            }
        }

        // Spracherkennung stoppen
        function stopSpeechRecognition() {
            if (recognizing) {
                recognition.stop();
                recognizing = false;
                console.log("Speech recognition stopped.");
            }
        }

        // Event Listener für den "normalen" button
        $(document).on('click', '.speech-action', function (event) {
            event.preventDefault();
            console.log("Speech action button clicked! Starting recognition...");
            infiniteMode = false;
            startSpeechRecognition();
        });

        // Event Listener für den Toggle Button
        $(document).on('click', '.toggle-action', function (event) {
            event.preventDefault();
            $(this).toggleClass('active');
            infiniteMode = $(this).hasClass('active');

            if (infiniteMode) {
                console.log("Infinite mode activated.");
                startSpeechRecognition();
            } else {
                console.log("Infinite mode deactivated.");
                stopSpeechRecognition();
            }
        });

        // Definieren der Sprachfehele
        recognition.onresult = function (event) {
            var transcript = event.results[event.resultIndex][0].transcript.trim().toLowerCase(); //immer neuestes Ergebnis verwenden
            console.log("Recognized speech:", transcript);
            //wenn die Eingabe 'setze datum' enhält, so verwende alles folgende (bis auf 'auf') als Eingabe
            if (transcript.includes('setze datum')) {
                const dateString = transcript.replace(/.*setze datum( auf)?\s*/, '').trim();
                setDateInFlatpickr(dateString);
            } else if (transcript.includes('create new content') || transcript.includes('neues inhaltselement')) {
                createNewContentElement();
            } else if (transcript.includes('speichern')) {
                saveContent();
            } else if (transcript.includes('speichern und schließen')) {
                saveAndCloseContent();
            } else if (transcript.includes('fenster schließen')) {
                closeForm();
            } else if (transcript.includes('seite anzeigen')) {
                viewPage();
            } else if (transcript.includes('tab')) {
                const tabName = transcript.replace(/.*\b(\w+)\s+tab\b.*/, '$1').trim(); //beispielsweise "language tab" -> "language"
                clickTab(tabName);
            } else if (transcript.includes('select header link') || transcript.includes('select heather link') || transcript.includes('select had our link')) {
                focusFieldByDataName('header_link');
            } else if (transcript.includes('select header') || transcript.includes('select heather')) {
                focusFieldByDataName('header');
            } else if (transcript.includes('select subheader')) {
                focusFieldByDataName('subheader');
            } else if (transcript.includes('text bearbeiten')) {
                focusEditor();
            } else if (transcript.includes('select datum')) {
                focusDateField();
            } else if (transcript.includes('select layout')) {
                openDropdown('header_layout');
            } else if (transcript.includes('select position')) {
                openDropdown('colPos');
            } else if (transcript.includes('eingabe') || transcript.includes('gebe ein')) { //wenn die Eingabe 'eingabe' enthält, so gebe alles darauf folgende in ein Textfeld ein
                const inputText = transcript.replace(/.*(eingabe|gebe ein)\s*/, '').trim();
                const focusedElement = document.activeElement;
                if (focusedElement) {
                    setInputToField(focusedElement, inputText);
                } else {
                    console.error("No field selected to input text.");
                }
            }
        };

        recognition.onerror = function (event) {
            console.error("Speech recognition error:", event.error);
        };

        // Wenn die Spracherkennung endet
        recognition.onend = function () {
            recognizing = false;
            console.log("Speech recognition ended.");

            // Neustart nur im unendlich/toggle Modus
            if (infiniteMode) {
                console.log("Restarting speech recognition in infinite mode...");
                startSpeechRecognition();
            }
        };

        // Funktion, um ein Feld zu finden und zu fokussieren/klicken
        function focusFieldByDataName(fieldName) {
            var field = document.querySelector(`[data-formengine-input-name*="[${fieldName}]"]`);
            if (field) {
                field.focus();
                field.click();
                console.log(`Focused on the ${fieldName} field.`);
            } else {
                console.error(`${fieldName} field not found.`);
            }
        }


        // Generic Methode zum Klicken auf einen Tab basierend auf dem gegebenen Inhalt
        function clickTab(tabName) {
            var tabLinks = document.querySelectorAll('a.nav-link');
            var foundTab = false;

            tabLinks.forEach(function(tab) {
                var tabText = tab.textContent.trim().toLowerCase();
                if (tabText === tabName.toLowerCase()) {
                    tab.click();
                    console.log("Clicked " + tabName + " tab.");
                    foundTab = true;
                }
            });
            if (!foundTab) {
                console.error(tabName + " tab not found.");
            }
        }

        // Funktion zum Öffnen eines dropdowns
        function openDropdown(fieldType) {
            var dropdown = document.querySelector(`select[name*="[${fieldType}]"]`);
            if (dropdown) {
                dropdown.focus();
                dropdown.click();
                console.log(`Opened ${fieldType} dropdown.`);
            } else {
                console.error(`${fieldType} dropdown not found.`);
            }
        }

        // Fokus auf das date input setzen
        function focusDateField() {
            var dateField = document.querySelector('input[data-formengine-datepicker-real-input-name*="[date]"]');
            if (dateField) {
                dateField.focus();
                console.log("Focused on date input field.");
            } else {
                console.error("Date input field not found.");
            }
        }

        // Fokus auf den Texteditor setzen
        function focusEditor() {
            var editorField = document.querySelector('div.ck-editor__editable[contenteditable="true"]');
            if (editorField) {
                editorField.focus();
                console.log("Focused on CKEditor text field.");
            } else {
                console.error("CKEditor text field not found.");
            }
        }

        // Funktion zur Erstellung eines neuen Inhaltselements
        function createNewContentElement() {
            var createButton = $('typo3-backend-new-content-element-wizard-button[subject="Create new content element"]').first();
            if (createButton.length) {
                createButton.click();
                console.log("Create new content element clicked.");
            } else {
                console.error("Create new content button not found.");
            }
        }

        //Speichern
        function saveContent() {
            var saveButton = document.querySelector('button[name="_savedok"]');
            if (saveButton) {
                saveButton.click();
                console.log("Save button clicked.");
            } else {
                console.error("Save button not found.");
            }
        }

        // Speichern und schließen
        function saveAndCloseContent() {
            var saveAndCloseButton = document.querySelector('button[name="saveAndClose"]');
            if (saveAndCloseButton) {
                saveAndCloseButton.click();
                console.log("Save and Close button clicked.");
            } else {
                console.error("Save and Close button not found.");
            }
        }

        // Close button klicken
        function closeForm() {
            var closeButton = document.querySelector('a.t3js-editform-close');
            if (closeButton) {
                closeButton.click();
                console.log("Close button clicked.");
            } else {
                console.error("Close button not found.");
            }
        }

        // View Button klicken
        function viewPage() {
            var viewButton = document.querySelector('a.t3js-editform-view');
            if (viewButton) {
                viewButton.click();
                console.log("View button clicked.");
            } else {
                console.error("View button not found.");
            }
        }

        // Funktion zum setzen des Textes in das aktuell fokussierte Feld
        function setInputToField(field, inputText) {
            if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA' || field.tagName === 'SELECT') {
                field.value = inputText;

                var event = new Event('change', {bubbles: true});
                field.dispatchEvent(event);
            } else if (field.isContentEditable || field.getAttribute('contenteditable') === 'true') { // Für CKEditor
                // Zugriff auf CKEditor
                const editorInstance = field.ckeditorInstance;

                if (editorInstance) {
                    // bestehenden Inhalt holen und neuen hinzufügen
                    const currentContent = editorInstance.getData();
                    const newContent = `${currentContent}<p>${inputText}</p>`;
                    editorInstance.setData(newContent);
                } else {
                    console.error("CKEditor instance not found");
                }
            } else {
                console.error("Selected field is not valid for input.");
            }
        }

        //datepicker befüllen, etwas wie heute auch ermöglichen
        function setDateInFlatpickr(dateString) {
            const flatpickrInput = document.querySelector('input.flatpickr-input');

            if (flatpickrInput && flatpickrInput._flatpickr) {
                if (dateString.trim().toLowerCase() === 'heute') {
                    const today = new Date().toISOString().slice(0, 10);
                    flatpickrInput._flatpickr.setDate(today, true);
                    console.log("Date 'heute' set in the datepicker.");
                } else {
                    const parsedDate = parseDate(dateString);
                    if (parsedDate) {
                        flatpickrInput._flatpickr.setDate(parsedDate, true);
                        console.log(`Date '${parsedDate}' set in the datepicker.`);
                    } else {
                        console.error("Invalid date format: " + dateString);
                    }
                }
            } else {
                console.error("Flatpickr instance not found or not initialized.");
            }
        }
        //datum anpassen, nach englisch/deutsch mappen
        function parseDate(dateString) {
            try {
                dateString = dateString.replace(/the|of|auf|st|nd|rd|th/gi, '').trim();

                const monthMap = {
                    'januar': 'january', 'februar': 'february', 'märz': 'march', 'april': 'april',
                    'mai': 'may', 'juni': 'june', 'juli': 'july', 'august': 'august',
                    'september': 'september', 'oktober': 'october', 'november': 'november', 'dezember': 'december'
                };

                dateString = dateString.toLowerCase().replace(/\b(januar|februar|märz|april|mai|juni|juli|august|september|oktober|november|dezember)\b/gi, function (match) {
                    return monthMap[match];
                });

                const dateParts = dateString.match(/(\d{1,2})\s([a-zA-Z]+)\s(\d{4})/);

                if (dateParts) {
                    const day = ('0' + dateParts[1]).slice(-2);
                    const month = dateParts[2].toLowerCase();
                    const year = dateParts[3];

                    // Konvertiere den namen in eine Zahl
                    const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
                    const monthIndex = monthNames.indexOf(month) + 1;
                    const monthFormatted = ('0' + monthIndex).slice(-2);

                    return `${year}-${monthFormatted}-${day}`;
                } else {
                    console.error("Unable to parse date string: " + dateString);
                    return null;
                }
            } catch (error) {
                console.error("Error parsing date: ", error);
                return null;
            }
        }

    } catch (e) {
        console.error("Speech recognition is not supported:", e);
    }
});
