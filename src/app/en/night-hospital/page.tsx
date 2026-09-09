import EnShell from "@/components/en/EnShell";
import { Sec, GuideTable } from "@/components/guides/GuideShell";
import { buildEnMetadata } from "@/data/guidesEn";

export const metadata = buildEnMetadata("night-hospital");

export default function EnNightHospitalPage() {
  return (
    <EnShell id="night-hospital">
      <Sec title="First decision: emergency room or not">
        <p>
          Chest pain, trouble breathing, heavy bleeding, sudden weakness or
          slurred speech, a child under 3 months with fever —{" "}
          <strong className="text-[#e8e8f0]">call 119</strong>. The ambulance is
          free and the crew takes you to an ER that can actually treat you,
          which matters more than distance.
        </p>
        <p>
          For everything that can wait a few hours — fever, stomach ache,
          sprains — an open clinic or duty pharmacy is faster and far cheaper
          than an ER visit.
        </p>
      </Sec>

      <Sec title="Find what is open right now: E-Gen">
        <p>
          <strong className="text-[#e8e8f0]">www.e-gen.or.kr</strong> is the
          official emergency-medicine portal. It lists every hospital, clinic,
          and pharmacy currently open near you, including holidays and
          late-night duty rotations. The interface is Korean — use your
          browser&apos;s translate function; the map and opening hours are easy
          to follow once translated.
        </p>
        <p>
          Quicker mobile alternative: open Naver Map or Kakao Map, search{" "}
          <strong className="text-[#e8e8f0]">약국</strong> (pharmacy) or{" "}
          <strong className="text-[#e8e8f0]">병원</strong> (hospital/clinic) and
          filter by &ldquo;open now&rdquo;. Calling 129 also works — they can
          look up open facilities for you.
        </p>
      </Sec>

      <Sec title="Late-night options, cheapest first">
        <GuideTable
          headers={["Option", "Good for"]}
          rows={[
            ["Convenience store (24/7)", "13 approved OTC medicines: acetaminophen (Tylenol), cold tablets, digestive aids, pain-relief patches"],
            ["Duty / late-night pharmacy", "Prescriptions and stronger OTC — find via E-Gen; some city pharmacies open past midnight"],
            ["Moonlight children's hospitals", "Pediatric care to late evening on weekdays and holidays — designed to keep kids out of ERs"],
            ["Emergency room", "True emergencies — open 24/7, but expect a surcharge and long non-urgent waits"],
          ]}
        />
      </Sec>

      <Sec title="Costs if you have no Korean health insurance">
        <p>
          Hospitals cannot refuse emergency treatment. Without National Health
          Insurance you pay the full uninsured rate — an ER visit for something
          minor can run into hundreds of thousands of won, so keep every
          receipt and itemized statement for your travel insurance claim.
        </p>
        <p>
          If you work in Korea or have stayed six months or more, you are most
          likely an NHIS member already — bring your ARC and the hospital
          checks eligibility on the spot.
        </p>
        <p className="text-xs text-[#606070]">
          Cannot pay an emergency bill at all? Korea has a deferred-payment
          system for emergency care and welfare support lines — call 129 before
          skipping treatment.
        </p>
      </Sec>

      <Sec title="English-speaking care">
        <p>
          Major university hospitals — Severance, Seoul National University
          Hospital, Asan Medical Center, Samsung Medical Center — run
          international clinics with English-speaking coordinators on weekdays.
          For urgent medical advice at night, 119 also handles medical
          consultation calls and can bring in an interpreter.
        </p>
      </Sec>
    </EnShell>
  );
}
