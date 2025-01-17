import { DashboardSsnM25Section as DashboardContent } from "./DashboardSsnM25Section";
import { MutakhirSection } from "./MutakhirSection";
import { CacahSection } from "./CacahSection";
import { PeriksaSection } from "./PeriksaSection";

export function DashboardSsnM25Section() {
  return <DashboardContent />;
}

export function InputPclSsnM25Section() {
  return (
    <>
      <MutakhirSection /> 
      <CacahSection />
    </>
  );
}

export function InputPmlSsnM25Section() {
  return <PeriksaSection />;
}
