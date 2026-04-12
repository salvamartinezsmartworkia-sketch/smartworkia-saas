import AdminAreaGate from "@/components/AdminAreaGate";
import AulaVirtualDemoShell from "@/components/AulaVirtualDemoShell";

export const metadata = {
  title: "Aula Virtual Demo | SmartWorkIA",
  description:
    "Demo privada de un aula virtual con Gamma embebido, modulos, recursos y practica integrada.",
};

export default function AulaVirtualDemoPage() {
  return (
    <AdminAreaGate withHeader={false}>
      <AulaVirtualDemoShell />
    </AdminAreaGate>
  );
}
