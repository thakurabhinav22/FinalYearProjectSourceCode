import { run } from './GenerativeAi.js'; // Adjust path as needed

document.addEventListener('DOMContentLoaded', function() {
    const readPdfButton = document.getElementById('readPdfButton');
    const storageFileInput = document.getElementById('StorageFile');

    // Set the workerSrc to the location of the pdf.worker.js file
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

    // Function to read the PDF file
    readPdfButton.addEventListener('click', function() {
        const file = storageFileInput.files[0];

        if (file) {
            const fileReader = new FileReader();

            fileReader.onload = function() {
                const typedarray = new Uint8Array(this.result);

                // Load PDF.js
                pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
                    let allText = ''; // Initialize variable to store all extracted text
                    let pagePromises = []; // Array to hold page promises

                    // Loop through all pages and get text
                    for (let i = 1; i <= pdf.numPages; i++) {
                        pagePromises.push(
                            pdf.getPage(i).then(function(page) {
                                return page.getTextContent().then(function(textContent) {
                                    let text = textContent.items.map(item => item.str).join(' ');
                                    console.log(`Page ${i}: ${text}`);
                                    allText += text + ' '; // Concatenate the text from each page
                                });
                            })
                        );
                    }

                    // Wait for all pages to be processed
                    Promise.all(pagePromises).then(function() {
                        if (allText.trim() === '') {
                            alert('Please upload a selectable PDF.'); 
                        } else {
                            console.log('PDF content extracted successfully.');
                            run(allText); // Call the run function from GenerativeAi.js
                        }
                    });

                }).catch(function(error) {
                    console.error('Error loading PDF: ', error);
                });
            };

            fileReader.readAsArrayBuffer(file);
        } else {
            console.error('No file selected.');
        }
    });
});
