import EnShell from "@/components/en/EnShell";
import { Sec, GuideTable } from "@/components/guides/GuideShell";
import { buildEnMetadata } from "@/data/guidesEn";

export const metadata = buildEnMetadata("scam-calls");

export default function EnScamCallsPage() {
  return (
    <EnShell id="scam-calls">
      <Sec title="The 3 scripts used on foreigners">
        <GuideTable
          headers={["Script", "How it goes"]}
          rows={[
            ["Fake immigration / police", "Your visa has a problem, an arrest warrant exists, deportation is imminent — pay a fine or 'verify' your bank account now"],
            ["Delivery smishing", "A text: parcel could not be delivered / customs fee due — with a link that installs a spy app or harvests card details"],
            ["Money mule recruiting", "Easy part-time job: receive transfers into your account and forward them for a cut — this is laundering stolen money"],
          ]}
        />
        <p>
          The common thread is <strong className="text-[#e8e8f0]">fear plus
          urgency</strong> — scammers know a visa threat lands harder on a
          foreigner than on anyone else.
        </p>
      </Sec>

      <Sec title="Golden rules — memorize these three">
        <p>
          1. Korean immigration, police, prosecutors, and banks{" "}
          <strong className="text-[#e8e8f0]">never demand money, gift cards, or
          app installs by phone</strong>. Never. Ending such a call is always
          correct.
        </p>
        <p>
          2. <strong className="text-[#e8e8f0]">Verify on a number you dial
          yourself</strong> — immigration 1345, police 112. Never call back a
          number the caller gave you or a text contained.
        </p>
        <p>
          3. <strong className="text-[#e8e8f0]">Never install an APK from a
          text link</strong>, and never share verification codes. One installed
          app can forward your calls and read your banking texts.
        </p>
      </Sec>

      <Sec title="Already paid? The first 10 minutes decide">
        <p>
          1. Call your <strong className="text-[#e8e8f0]">bank&apos;s fraud
          line</strong> and <strong className="text-[#e8e8f0]">112</strong>{" "}
          immediately and request a payment suspension (jigeup-jeongji) on the
          receiving account. Money frozen before the mule withdraws it can be
          refunded through the official reimbursement process.
        </p>
        <p>
          2. File the police report and keep everything — numbers, texts,
          transfer receipts. English help: interpretation via 112 itself, or
          1330 to bridge the call.
        </p>
        <p>
          3. Financial Supervisory Service <strong className="text-[#e8e8f0]">1332</strong>{" "}
          guides the refund procedure and disputes.
        </p>
      </Sec>

      <Sec title="Clicked a link or installed something?">
        <p>1. <strong className="text-[#e8e8f0]">Airplane mode</strong> — cut its connection first</p>
        <p>2. Delete the app; on Android check Settings → Apps for anything you did not install</p>
        <p>3. Change banking and email passwords <strong className="text-[#e8e8f0]">from a different device</strong></p>
        <p>4. Report to KISA at <strong className="text-[#e8e8f0]">118</strong> (24/7 hacking &amp; smishing hotline); when in doubt, factory-reset the phone</p>
        <p className="text-xs text-[#606070]">
          Only clicked, installed nothing, entered nothing? You are almost
          certainly fine — delete the text and move on.
        </p>
      </Sec>

      <Sec title="One more warning: your account is not for rent">
        <p>
          Lending your bank account, ARC, or phone number — or forwarding
          transfers for a &ldquo;job&rdquo; — makes you a money mule. In Korea
          that carries criminal liability and, for foreigners, deportation risk{" "}
          <strong className="text-[#e8e8f0]">even if you claim you did not
          know</strong>. No legitimate employer ever needs your bank account to
          pass money through.
        </p>
      </Sec>
    </EnShell>
  );
}
