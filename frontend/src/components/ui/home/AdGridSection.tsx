import React from "react";
import AdSlider from "@/components/AdSlider";

const AdGridSection = () => (
  <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <div className="lg:col-span-1 h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
        <AdSlider position="largeSquare1" />
      </div>

      <div className="lg:col-span-1 flex flex-col gap-4 sm:gap-6 h-auto lg:h-[600px]">
        <div className="h-[150px] sm:h-[200px] md:h-[250px] lg:h-[294px]">
          <AdSlider position="rectangle1" />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <div className="h-[140px] sm:h-[180px] md:h-[220px] lg:h-[283px]">
            <AdSlider position="smallSquare1" />
          </div>
          <div className="h-[140px] sm:h-[180px] md:h-[220px] lg:h-[283px]">
            <AdSlider position="smallSquare2" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AdGridSection;
