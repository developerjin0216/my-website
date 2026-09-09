import EnShell from "@/components/en/EnShell";
import { Sec, GuideTable } from "@/components/guides/GuideShell";
import { buildEnMetadata } from "@/data/guidesEn";

export const metadata = buildEnMetadata("emergency-numbers");

export default function EnEmergencyNumbersPage() {
  return (
    <EnShell id="emergency-numbers">
      <Sec title="The two numbers that matter">
        <p>
          <strong className="text-[#e8e8f0]">112 — Police.</strong> Crime,
          assault, theft, stalking, missing persons. <strong className="text-[#e8e8f0]">119
          — Fire &amp; Ambulance.</strong> Fire, injury, sudden illness, rescue.
          Both are free, work from any phone (even with no SIM), and operate
          24/7 nationwide. If you call the wrong one, they transfer you — do
          not hang up to redial.
        </p>
        <p>
          Neither line guarantees an English speaker picks up, but both can
          pull an interpreter into the call. Say{" "}
          <strong className="text-[#e8e8f0]">&ldquo;English, please&rdquo;</strong> and
          stay on the line while they connect the three-way interpretation.
        </p>
      </Sec>

      <Sec title="English-first help lines">
        <GuideTable
          headers={["Number", "What it does"]}
          rows={[
            ["1330", "Korea Travel Helpline — 24/7, English·Chinese·Japanese. Tourist help, and it will interpret between you and 112/119 in an emergency"],
            ["1345", "Immigration Contact Center — visa, ARC, stay questions in 20+ languages (weekdays)"],
            ["1588-5644", "BBB Korea — free volunteer phone interpreters, around the clock"],
            ["1577-1366", "Danuri Helpline — 24/7 in 13 languages; family, domestic violence, life support for migrants"],
            ["02-120", "Seoul Dasan Call Center — city services with an English option (other cities: area code + 120)"],
            ["129", "Health & Welfare Call Center — hospitals, welfare, emergency medical cost programs"],
          ]}
        />
      </Sec>

      <Sec title="If you cannot speak Korean at all">
        <p>1. <strong className="text-[#e8e8f0]">Text 112</strong> — SMS reports work and transmit your location. Short English sentences are fine.</p>
        <p>2. <strong className="text-[#e8e8f0]">Call 1330 first</strong> if the situation allows — an English speaker answers immediately and conferences in the police or ambulance.</p>
        <p>3. <strong className="text-[#e8e8f0]">Tell them where you are</strong> — read the blue building-number plate on any building, name a big landmark or subway exit, or read the number printed on a utility pole. Phone reports transmit GPS, but indoor accuracy is poor.</p>
      </Sec>

      <Sec title="Which number for which situation">
        <GuideTable
          headers={["Situation", "Call"]}
          rows={[
            ["Crime, threat, missing person", "112"],
            ["Fire, injury, ambulance, rescue", "119"],
            ["Not sure / need English right now", "1330"],
            ["Visa or immigration question", "1345"],
            ["Gas smell", "119 + your city gas company (number on the bill)"],
            ["Embassy matters (lost passport, arrest)", "Your embassy — keep its number saved offline"],
          ]}
        />
      </Sec>
    </EnShell>
  );
}
