
const downloadSpeakerNotes = () => {
    // Get the current Google Slide
    const presentation = SlidesApp.getActivePresentation();

    // Find all the slides in the current presentation
    const slides = presentation.getSlides();

    // slides
    //   .map((slide, index) => {
    //     slide
    //       .getNotesPage()
    //       .getSpeakerNotesShape()
    //       .getText()
    //       .getListParagraphs()
    //       .map((p) => p.getRange().insertText(0, "- "))
    //   })

    // Iterate through each slide and extract the notes
    const notes = slides
        .map((slide, index) => {
            const note = slide
                .getNotesPage()
                .getSpeakerNotesShape()
                .getText()
                .getParagraphs()
                .map((p, i) => p)
                .asRenderedString();
            return { index, note };
        })
        // Filter slides that have no speaker notes
        .filter(({ note }) => note)
        .map(({ note, index }) => {
            return [`Slide #${index + 1}`, '---', note].join('\n');
        })
        .join('\n');

    // Create a file in Google Drive for storing notes
    const fileName = "[Teleprompter] " + SlidesApp.getActivePresentation().getName() + ".txt"

    // const speakerNoteFolder = DriveApp.getFolderById("1k8Qi2t5WLeBFU9Pa5gUm5SHCc-OsjzD2")
    const speakerNoteFolder = DriveApp.getFileById(presentation.getId()).getParents().next()
    const teleprompterFiles = speakerNoteFolder.getFilesByName(fileName)
    if (teleprompterFiles.hasNext()) {
        teleprompterFiles.next().setContent(notes)
    } else {
        speakerNoteFolder.createFile(fileName, notes)
    }
};