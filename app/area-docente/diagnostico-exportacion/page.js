import AdminAreaGate from "@/components/AdminAreaGate";
import ExportScannerOriginal from "@/components/teaching-tools/ExportScannerOriginal";

export const metadata = {
  title: "Diagnostico Exportacion | Area Docente | SmartWorkIA",
  description:
    "Herramienta docente para evaluar la preparacion exportadora de una empresa.",
};

export default function AreaDocenteDiagnosticoExportacionPage() {
  return (
    <AdminAreaGate withHeader={false}>
      <ExportScannerOriginal />
    </AdminAreaGate>
  );
}
