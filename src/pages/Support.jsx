import { HelpCircle } from "lucide-react";

export default function Support() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-black">Support - About HydroNex</h1>

      {/* Platform Presentation */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-blue-600 flex items-center gap-2">
          <HelpCircle className="w-6 h-6" />
          What is HydroNex?
        </h2>
        <p className="text-gray-700 leading-relaxed text-sm">
          <strong>HydroNex</strong> is an innovative floating IoT solution designed for
          <strong> real-time monitoring of water quality and coastal salinity</strong>.
          It combines autonomous IoT devices, an interactive dashboard, an intelligent alert system,
          an automated newsletter, and a virtual assistant called <strong>HydroBot</strong>.
        </p>
      </section>

      {/* How it works */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">
          How does HydroNex work?
        </h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-3 text-sm">
          <li>
            🌊 <strong>Floating IoT sensors:</strong> installed on water, these devices continuously
            measure key parameters such as temperature, turbidity, pH, dissolved oxygen, and salinity.
          </li>
          <li>
            ☁️ <strong>Data transmission:</strong> data is transmitted via network (Wi-Fi)
            to the central platform.
          </li>
          <li>
            📊 <strong>Interactive dashboard:</strong> accessible from any browser,
            it allows you to visualize real-time data, analyze trends, and compare
            different sites.
          </li>
          <li>
            🚨 <strong>Intelligent alert system:</strong> when a critical threshold is exceeded
            (e.g. high salinity), an alert is generated with an automatic recommendation.
          </li>
          <li>
            📨 <strong>Automated newsletter:</strong> a regular summary is sent by email with
            the latest data, alerts, and recommendations.
          </li>
          <li>
            🤖 <strong>HydroBot:</strong> an integrated virtual assistant to ask questions, request
            advice, and quickly obtain data summaries.
          </li>
        </ul>
      </section>

      {/* Goals and advantages */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">
          Why use HydroNex?
        </h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2 text-sm">
          <li>Improve sustainable water resource management.</li>
          <li>Make quick decisions based on reliable data.</li>
          <li>Prevent water pollution and environmental risks.</li>
          <li>Facilitate monitoring of multiple sites simultaneously.</li>
          <li>Simplify access to information for local stakeholders and decision-makers.</li>
        </ul>
      </section>

      {/* Support contact */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">
          Need help?
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed">
          For any technical question or assistance request, please contact us:
        </p>
        <ul className="mt-2 text-gray-700 text-sm">
          <li>📧 Email: <a href="mailto:shydronex@gmail.com" className="text-blue-600 underline">shydronex@gmail.com</a></li>
          <li>📞 Phone: +229 58 22 63 60</li>
        </ul>
      </section>

      <p className="text-xs text-gray-500 text-center">
        HydroNex © 2025 — All rights reserved
      </p>
    </div>
  );
}