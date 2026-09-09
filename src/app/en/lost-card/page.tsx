import EnShell from "@/components/en/EnShell";
import { Sec, GuideTable } from "@/components/guides/GuideShell";
import { buildEnMetadata } from "@/data/guidesEn";

export const metadata = buildEnMetadata("lost-card");

export default function EnLostCardPage() {
  return (
    <EnShell id="lost-card">
      <Sec title="First 10 minutes: freeze everything">
        <p>
          1. <strong className="text-[#e8e8f0]">Freeze your cards</strong> — use
          each issuer&apos;s app (fastest), or call the issuer. Korean card
          companies offer a <strong className="text-[#e8e8f0]">batch loss
          report</strong>: report to any one Korean card company you use and ask
          them to relay the loss to the others in one call.
        </p>
        <p>
          2. <strong className="text-[#e8e8f0]">Check recent transactions</strong>{" "}
          — screenshot anything you did not make. Do not wait for the
          statement.
        </p>
        <p>
          3. Foreign cards: call the number on your bank&apos;s app or the
          global Visa/Mastercard emergency lines. Do this before hunting for
          the wallet — freezing is reversible, fraud is not.
        </p>
      </Sec>

      <Sec title="Where lost things actually turn up">
        <GuideTable
          headers={["Where you lost it", "Where to look"]}
          rows={[
            ["Anywhere / not sure", "Lost112 (www.lost112.go.kr) — the national police lost-and-found database with photos; it has an English mode. Check daily for ~2 weeks"],
            ["Subway", "Each line runs lost-and-found centers at designated stations — search the line name + lost and found, or ask any station office"],
            ["Taxi", "Paid by card? The receipt or your card app identifies the taxi company — call them directly"],
            ["Bus", "Note the route number and call the bus company (the city 120 call center can connect you)"],
          ]}
        />
        <p>
          Korea has a strong hand-it-to-the-police culture — a large share of
          wallets come back with cards intact. Report it as lost anyway.
        </p>
      </Sec>

      <Sec title="Reissuing what was inside">
        <GuideTable
          headers={["Item", "How to replace"]}
          rows={[
            ["ARC (residence card)", "Within 14 days: reserve at your immigration office via HiKorea, bring passport + photo + fee"],
            ["Passport", "Police lost report first, then your embassy for a replacement or emergency travel document"],
            ["Korean bank card", "Bank app reissue or any branch with ID — takes minutes, delivery in a few days"],
            ["Driver's license", "Any police station licensing desk or driver's license agency with ID + fee"],
          ]}
        />
      </Sec>

      <Sec title="Fraudulent charges: who pays">
        <p>
          Under Korean credit-finance law, once you report the loss, the card
          company generally covers fraudulent charges made from{" "}
          <strong className="text-[#e8e8f0]">60 days before the report</strong>{" "}
          onward — unless you were grossly negligent (PIN written on the card,
          card lent to someone). So the report timestamp is your protection:
          report first, argue details later.
        </p>
      </Sec>
    </EnShell>
  );
}
