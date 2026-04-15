import PublicFooter from "@/components/PublicFooter";
import PublicHeader from "@/components/PublicHeader";
import SimLogLeadMagnetApp from "@/components/public-tools/SimLogLeadMagnetApp";

export const metadata = {
  title: "SimLog",
  description:
    "Herramienta abierta de auditoría operativa guiada para logística y distribución.",
};

export default function SimLogLeadMagnetPage() {
  return (
    <>
      <PublicHeader />
      <SimLogLeadMagnetApp />
      <PublicFooter />
    </>
  );
}
