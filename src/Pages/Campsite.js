import React, { lazy, Suspense } from "react";
import LoadingFallback from "../components/LoadingFallback";

const Map = lazy(() => import("../components/Map/Map"));

const Campsite = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Map />
    </Suspense>
  );
};

export default Campsite;
