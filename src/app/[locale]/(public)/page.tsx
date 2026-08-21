import { setRequestLocale } from "next-intl/server";

import { listStations } from "@/actions/stations";
import { listFeaturedFeedback } from "@/actions/feedback";
import { Hero } from "@/components/home/hero";
import { StatsBar } from "@/components/home/stats-bar";
import { StationsPreview } from "@/components/home/stations-preview";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { FranchiseCta } from "@/components/home/franchise-cta";
import { Testimonials } from "@/components/home/testimonials";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [stations, testimonials] = await Promise.all([
    listStations(),
    listFeaturedFeedback(),
  ]);

  const stationCount = stations.length;
  const chargerCount = stations.reduce((sum, s) => sum + s.charger_count, 0);
  const connectorCount = stations.reduce((sum, s) => sum + s.connector_count, 0);

  return (
    <>
      <Hero />
      <StatsBar
        stationCount={stationCount}
        chargerCount={chargerCount}
        connectorCount={connectorCount}
      />
      <StationsPreview stations={stations} />
      <WhyChooseUs />
      <FranchiseCta />
      <Testimonials feedback={testimonials} />
    </>
  );
}
