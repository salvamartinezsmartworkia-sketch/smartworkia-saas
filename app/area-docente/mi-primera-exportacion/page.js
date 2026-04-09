import AdminAreaGate from "@/components/AdminAreaGate";
import MiPrimeraExportacionOriginal from "@/components/teaching-tools/MiPrimeraExportacionOriginal";

export const metadata = {
  title: "Mi Primera Exportacion | Area Docente | SmartWorkIA",
  description:
    "Simulador docente de comercio exterior para practicar canal, Incoterm, logistica, cobro y escandallo.",
};

export default function AreaDocenteMiPrimeraExportacionPage() {
  return (
    <AdminAreaGate withHeader={false}>
      <MiPrimeraExportacionOriginal />
    </AdminAreaGate>
  );
}
