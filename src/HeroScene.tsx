import Spline from '@splinetool/react-spline';

export default function HeroScene() {
  return (
    <div className="relative h-[500px] w-full overflow-hidden xl:h-[700px] flex items-center justify-center" style={{ pointerEvents: 'none' }}>
      <div className="w-full h-full scale-[1.3] sm:scale-[1.5] md:scale-[1.3] origin-center">
        <Spline
          scene="https://prod.spline.design/6yD6FSIerDpK6Xmx/scene.splinecode"
        />
      </div>
    </div>
  );
}
