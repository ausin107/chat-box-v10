import mammoth from 'mammoth'
import pdfToText from 'react-pdftotext'

async function handleFileToText(file) {
  if (file) {
    let result = ''
    if (file.type === 'application/pdf') {
      result = pdfToText(file)
        .then((text) => {
          return text
        })
        .catch((error) => console.error('Failed to extract text from pdf'))
    } else {
      const buffer = await file.arrayBuffer()
      result = mammoth
        .extractRawText({ arrayBuffer: buffer })
        .then(function (resultObject) {
          return resultObject.value
        })
        .catch((error) => console.error('Failed to extract text from docx'))
    }
    return result
  }
}
export default handleFileToText
