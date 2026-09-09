import EnShell from "@/components/en/EnShell";
import { Sec, GuideTable } from "@/components/guides/GuideShell";
import { buildEnMetadata } from "@/data/guidesEn";

export const metadata = buildEnMetadata("lost-phone");

export default function EnLostPhonePage() {
  return (
    <EnShell id="lost-phone">
      <Sec title="First: lock it remotely">
        <p>
          From any browser: <strong className="text-[#e8e8f0]">iCloud Find My</strong>{" "}
          (Apple) or <strong className="text-[#e8e8f0]">Find My Device</strong>{" "}
          (Google). Mark it as lost, which locks the screen, and display a
          message with an alternate contact — a finder in Korea will very often
          call it.
        </p>
        <p>
          Do not wipe it yet — a wiped phone cannot be tracked. Wipe only when
          you give up on recovery or it holds sensitive work data.
        </p>
      </Sec>

      <Sec title="Suspend the line and block the IMEI">
        <p>
          1. <strong className="text-[#e8e8f0]">Carrier</strong> — call SKT, KT,
          or LG U+ (or your budget MVNO) to suspend the line so nobody runs up
          charges or receives your verification texts.
        </p>
        <p>
          2. <strong className="text-[#e8e8f0]">IMEI blacklist</strong> — Korea
          runs a shared lost-device registry (Korea Mobile Phone Find Center,
          www.handphone.or.kr). Once registered, the device cannot join any
          Korean network even with a new SIM — worthless to sell, and more
          likely to be returned.
        </p>
        <p>
          3. On a tourist SIM or eSIM? Suspend through the provider&apos;s app
          or site, then still file the police report below.
        </p>
      </Sec>

      <Sec title="Where to look">
        <GuideTable
          headers={["Route", "How"]}
          rows={[
            ["Lost112", "National police lost-and-found (www.lost112.go.kr, English available) — found phones are photographed and listed; check daily for 1–2 weeks"],
            ["Subway", "Line-operated lost-and-found centers — tell them the time, line, and car position if you can"],
            ["Taxi", "Trace the taxi through your card receipt or ride app history and call the company"],
            ["Bar / restaurant", "Call before visiting — staff usually keep phones behind the counter for a few days"],
          ]}
        />
      </Sec>

      <Sec title="If it was stolen, not lost">
        <p>
          File a police report at any station (bring your passport). You need
          the report number for phone insurance, travel insurance, and for
          disputing any charges. Never arrange to meet someone who{" "}
          &ldquo;found&rdquo; your phone and wants a finder&apos;s fee in cash —
          hand that conversation to the police.
        </p>
      </Sec>
    </EnShell>
  );
}
