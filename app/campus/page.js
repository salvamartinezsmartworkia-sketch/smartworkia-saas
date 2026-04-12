import AdminAreaGate from "@/components/AdminAreaGate";
import CampusLandingShell from "@/components/CampusLandingShell";

export const metadata = {
  title: "Campus SmartWorkIA",
  description:
    "Portada privada del campus con cursos, aulas y formaciones SmartWorkIA.",
};

export default function CampusPage() {
  return (
    <AdminAreaGate withHeader={false}>
      <CampusLandingShell />
    </AdminAreaGate>
  );
}
