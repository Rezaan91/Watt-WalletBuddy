import wattwalletLogo from "../../imports/wattwallet-logo.png";

export default function BackgroundLogo() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-5 dark:opacity-[0.02]">
        <img
          src={wattwalletLogo}
          alt=""
          className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-screen"
        />
      </div>
    </div>
  );
}
