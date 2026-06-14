import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Welcome — Nectar" },
      { name: "description", content: "Welcome to Nectar online groceries." },
    ],
  }),
  component: Onboarding,
});

function Onboarding() {
  return (
    <div className="min-h-screen bg-[#F2F3F2] lg:py-12 lg:px-4 flex flex-col justify-center">
      <Link to="/signin" className="animate-page-in relative block min-h-screen bg-black lg:max-w-md lg:mx-auto lg:w-full lg:h-[90vh] lg:max-h-[800px] lg:min-h-[650px] lg:py-8 lg:rounded-[30px] lg:overflow-hidden lg:shadow-2xl">
      <img
        src="/images/onboarding_bg.png"
        alt="Fresh groceries delivery"
        className="absolute inset-0 h-full w-full object-cover"
      />
      </Link>
    </div>
  );
}
