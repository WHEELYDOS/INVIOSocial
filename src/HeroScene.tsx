import Spline from '@splinetool/react-spline';

export default function HeroScene() {
  return (
    <div className="relative h-[440px] w-full overflow-hidden xl:h-[580px] flex items-center justify-center">
      <div className="w-full h-full scale-[1.3] sm:scale-[1.5] md:scale-[1.3] origin-center">
        <Spline
          scene="https://prod.spline.design/4ntVT1Z2LBCFfhSm/scene.splinecode"
        />
      </div>
    </div>
  );
}
