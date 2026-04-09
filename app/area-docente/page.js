import AdminAreaGate from "@/components/AdminAreaGate";
import TeachingAreaShell from "@/components/TeachingAreaShell";

export const metadata = {
  title: "Area Docente | SmartWorkIA",
  description:
    "Entorno docente de SmartWorkIA para mostrar herramientas educativas interactivas en clase.",
};

export default function AreaDocentePage() {
  return (
    <AdminAreaGate>
      <TeachingAreaShell />
    </AdminAreaGate>
  );
}
