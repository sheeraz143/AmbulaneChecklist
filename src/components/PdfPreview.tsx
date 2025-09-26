import checklistPdf from "../assets/checklist.pdf";

export default function PdfPreview() {
  return (
    <div className="mt-6 border rounded-lg p-4 shadow-sm">
      <h3 className="text-md font-semibold mb-2">Checklist PDF</h3>
      <embed
        src={checklistPdf}
        type="application/pdf"
        className="w-full h-96 rounded"
      />
      <a
        href={checklistPdf}
        download="checklist.pdf"
        className="mt-2 inline-block bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        Download PDF
      </a>
    </div>
  );
}
