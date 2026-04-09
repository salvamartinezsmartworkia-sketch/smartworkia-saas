import AdminAreaGate from "@/components/AdminAreaGate";
import Incoterms2020Original from "@/components/teaching-tools/Incoterms2020Original";

export const metadata = {
  title: "Incoterms 2020 | Area Docente | SmartWorkIA",
  description:
    "Herramienta docente de Incoterms 2020 en vista completa para clase.",
};

export default function AreaDocenteIncotermsPage() {
  return (
    <AdminAreaGate withHeader={false}>
      <Incoterms2020Original />
    </AdminAreaGate>
  );
}
